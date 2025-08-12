import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

export interface Era {
  id: string;
  name: string;
  start: number; // year
  end: number;   // year
  color?: string;
}

export interface TimelineEvent {
  id: string;
  name: string;
  date: number; // year
  eraId?: string;
  category?: string;
  connections?: string[]; // ids of other events
}

export interface TimelineProps {
  eras: Era[];
  events: TimelineEvent[];
}

// Utility to extract unique categories for filtering
function getCategories(events: TimelineEvent[]): string[] {
  const set = new Set(events.map(e => e.category).filter(Boolean) as string[]);
  return Array.from(set);
}

/**
 * TimelineWorldHistoryManager
 *
 * Renders a simple horizontal timeline with eras, events and optional
 * connections between events. Users can filter events by category.
 */
export const TimelineWorldHistoryManager: React.FC<TimelineProps> = ({ eras, events }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const categories = useMemo(() => getCategories(events), [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategories.size === 0) return events;
    return events.filter(e => e.category && selectedCategories.has(e.category));
  }, [events, selectedCategories]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    svg.selectAll('*').remove();

    if (events.length === 0) return;

    const years = events.map(e => e.date);
    const minYear = d3.min(years)!;
    const maxYear = d3.max(years)!;

    const x = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([50, width - 50]);

    // Draw eras as rectangles
    const eraGroup = svg.append('g').attr('class', 'eras');
    eraGroup.selectAll('rect')
      .data(eras)
      .enter()
      .append('rect')
      .attr('x', era => x(era.start))
      .attr('y', 20)
      .attr('width', era => x(era.end) - x(era.start))
      .attr('height', 30)
      .attr('fill', era => era.color || '#e0e0e0')
      .append('title')
      .text(era => era.name);

    // Draw events as circles
    const eventGroup = svg.append('g').attr('class', 'events');
    const eventSelection = eventGroup.selectAll('circle')
      .data(filteredEvents, (d: any) => d.id);

    const entered = eventSelection.enter();

    entered.append('circle')
      .attr('cx', ev => x(ev.date))
      .attr('cy', 80)
      .attr('r', 6)
      .attr('fill', '#1976d2')
      .append('title')
      .text(ev => `${ev.name} (${ev.date})`);

    // Draw connections
    const connections: {source: TimelineEvent; target: TimelineEvent}[] = [];
    filteredEvents.forEach(ev => {
      (ev.connections || []).forEach(id => {
        const target = events.find(e => e.id === id);
        if (target) connections.push({ source: ev, target });
      });
    });

    svg.append('g').attr('class', 'connections')
      .selectAll('line')
      .data(connections)
      .enter()
      .append('line')
      .attr('x1', d => x(d.source.date))
      .attr('y1', 80)
      .attr('x2', d => x(d.target.date))
      .attr('y2', 80)
      .attr('stroke', '#555');

    // Axis
    const axis = d3.axisBottom(x).tickFormat(d3.format('d'));
    svg.append('g')
      .attr('transform', `translate(0,100)`)
      .call(axis);
  }, [events, eras, filteredEvents]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category); else next.add(category);
      return next;
    });
  };

  return (
    <div className="timeline-manager">
      {categories.length > 0 && (
        <div className="timeline-filters">
          {categories.map(cat => (
            <label key={cat} style={{ marginRight: '1rem' }}>
              <input
                type="checkbox"
                checked={selectedCategories.has(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      )}
      <svg ref={svgRef} width={800} height={120} />
    </div>
  );
};

export default TimelineWorldHistoryManager;