import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface RelationshipNode {
  id: string;
  name: string;
  group?: string;
}

export interface RelationshipLink {
  source: string;
  target: string;
  value?: number;
}

export interface RelationshipData {
  nodes: RelationshipNode[];
  links: RelationshipLink[];
}

export interface RelationshipVisualizerProps {
  data: RelationshipData;
  width?: number;
  height?: number;
}

/**
 * RelationshipVisualizer
 *
 * Converts the old relationship_visualizer.html implementation into a React
 * component that renders a force-directed graph using D3. The simulation is
 * created inside a useEffect hook so it only runs on the client.
 */
export const RelationshipVisualizer: React.FC<RelationshipVisualizerProps> = ({ data, width = 600, height = 400 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<RelationshipNode>(data.nodes)
      .force('link', d3.forceLink<RelationshipNode, RelationshipLink>(data.links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value || 1));

    // Draw nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', d => d3.schemeCategory10[(d.group ? parseInt(d.group, 10) : 0) % 10])
      .call(
        d3.drag<SVGCircleElement, RelationshipNode>()
          .on('start', event => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on('drag', event => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end', event => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = undefined;
            event.subject.fy = undefined;
          })
      );

    node.append('title').text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => (d as any).x)
        .attr('cy', d => (d as any).y);
    });
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};

export default RelationshipVisualizer;