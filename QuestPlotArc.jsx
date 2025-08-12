import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const QuestPlotArcManager = () => {
  const [arcs, setArcs] = useState([]);
  const [activeArc, setActiveArc] = useState(null);
  const [showArcForm, setShowArcForm] = useState(false);
  const [showQuestForm, setShowQuestForm] = useState(false);
  
  // Form states
  const [arcForm, setArcForm] = useState({
    title: '',
    description: '',
    act1: '',
    act2: '',
    act3: '',
    consequences: '',
    progress: 0,
    status: 'planning' // planning, active, completed, abandoned
  });
  
  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    type: 'main', // main or side
    objectives: [{ id: uuidv4(), description: '', completed: false }],
    obstacles: '',
    twists: '',
    rewards: '',
    consequences: '',
    progress: 0,
    status: 'available' // available, in-progress, completed, failed
  });

  // Arc CRUD operations
  const createArc = () => {
    const newArc = {
      id: uuidv4(),
      ...arcForm,
      quests: []
    };
    setArcs([...arcs, newArc]);
    setArcForm({
      title: '',
      description: '',
      act1: '',
      act2: '',
      act3: '',
      consequences: '',
      progress: 0,
      status: 'planning'
    });
    setShowArcForm(false);
  };

  const updateArc = () => {
    setArcs(arcs.map(arc => 
      arc.id === activeArc.id ? { ...arc, ...arcForm } : arc
    ));
    setShowArcForm(false);
  };

  const deleteArc = (id) => {
    setArcs(arcs.filter(arc => arc.id !== id));
    if (activeArc && activeArc.id === id) {
      setActiveArc(null);
    }
  };

  // Quest CRUD operations
  const createQuest = () => {
    const newQuest = {
      id: uuidv4(),
      ...questForm
    };
    
    setArcs(arcs.map(arc => 
      arc.id === activeArc.id 
        ? { ...arc, quests: [...arc.quests, newQuest] } 
        : arc
    ));
    
    setQuestForm({
      title: '',
      description: '',
      type: 'main',
      objectives: [{ id: uuidv4(), description: '', completed: false }],
      obstacles: '',
      twists: '',
      rewards: '',
      consequences: '',
      progress: 0,
      status: 'available'
    });
    
    setShowQuestForm(false);
  };

  const updateQuest = (questId) => {
    setArcs(arcs.map(arc => 
      arc.id === activeArc.id
        ? {
            ...arc,
            quests: arc.quests.map(quest =>
              quest.id === questId ? { ...quest, ...questForm } : quest
            )
          }
        : arc
    ));
    setShowQuestForm(false);
  };

  const deleteQuest = (questId) => {
    setArcs(arcs.map(arc => 
      arc.id === activeArc.id
        ? { ...arc, quests: arc.quests.filter(quest => quest.id !== questId) }
        : arc
    ));
  };

  // Form handlers
  const handleArcFormChange = (e) => {
    const { name, value } = e.target;
    setArcForm({ ...arcForm, [name]: value });
  };

  const handleQuestFormChange = (e) => {
    const { name, value } = e.target;
    setQuestForm({ ...questForm, [name]: value });
  };

  const handleObjectiveChange = (id, value) => {
    setQuestForm({
      ...questForm,
      objectives: questForm.objectives.map(obj =>
        obj.id === id ? { ...obj, description: value } : obj
      )
    });
  };

  const toggleObjectiveCompletion = (id) => {
    setQuestForm({
      ...questForm,
      objectives: questForm.objectives.map(obj =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      )
    });
  };

  const addObjective = () => {
    setQuestForm({
      ...questForm,
      objectives: [
        ...questForm.objectives,
        { id: uuidv4(), description: '', completed: false }
      ]
    });
  };

  const removeObjective = (id) => {
    setQuestForm({
      ...questForm,
      objectives: questForm.objectives.filter(obj => obj.id !== id)
    });
  };

  // Progress calculation
  const calculateProgress = (objectives) => {
    if (!objectives || objectives.length === 0) return 0;
    const completed = objectives.filter(obj => obj.completed).length;
    return Math.round((completed / objectives.length) * 100);
  };

  // Edit handlers
  const editArc = (arc) => {
    setActiveArc(arc);
    setArcForm({
      title: arc.title,
      description: arc.description,
      act1: arc.act1,
      act2: arc.act2,
      act3: arc.act3,
      consequences: arc.consequences,
      progress: arc.progress,
      status: arc.status
    });
    setShowArcForm(true);
  };

  const editQuest = (quest) => {
    setQuestForm({
      title: quest.title,
      description: quest.description,
      type: quest.type,
      objectives: quest.objectives,
      obstacles: quest.obstacles,
      twists: quest.twists,
      rewards: quest.rewards,
      consequences: quest.consequences,
      progress: quest.progress,
      status: quest.status
    });
    setShowQuestForm(true);
  };

  return (
    <div className="quest-arc-manager">
      <h1>Quest & Plot Arc Manager</h1>
      
      {/* Arc List */}
      <div className="arc-list">
        <h2>Plot Arcs</h2>
        <button onClick={() => {
          setActiveArc(null);
          setShowArcForm(true);
          setArcForm({
            title: '',
            description: '',
            act1: '',
            act2: '',
            act3: '',
            consequences: '',
            progress: 0,
            status: 'planning'
          });
        }}>Create New Arc</button>
        
        {arcs.map(arc => (
          <div key={arc.id} className={`arc-card ${activeArc?.id === arc.id ? 'active' : ''}`}>
            <h3>{arc.title}</h3>
            <p>Status: {arc.status}</p>
            <p>Progress: {arc.progress}%</p>
            <div className="progress-bar">
              <div style={{ width: `${arc.progress}%` }}></div>
            </div>
            <button onClick={() => setActiveArc(arc)}>View Details</button>
            <button onClick={() => editArc(arc)}>Edit</button>
            <button onClick={() => deleteArc(arc.id)}>Delete</button>
          </div>
        ))}
      </div>
      
      {/* Arc Details */}
      {activeArc && !showArcForm && !showQuestForm && (
        <div className="arc-details">
          <h2>{activeArc.title}</h2>
          <p><strong>Status:</strong> {activeArc.status}</p>
          <p><strong>Progress:</strong> {activeArc.progress}%</p>
          
          <h3>Three-Act Structure</h3>
          <div className="act-structure">
            <div>
              <h4>Act 1: Setup</h4>
              <p>{activeArc.act1}</p>
            </div>
            <div>
              <h4>Act 2: Confrontation</h4>
              <p>{activeArc.act2}</p>
            </div>
            <div>
              <h4>Act 3: Resolution</h4>
              <p>{activeArc.act3}</p>
            </div>
          </div>
          
          <h3>Consequences</h3>
          <p>{activeArc.consequences}</p>
          
          <h3>Quests</h3>
          <button onClick={() => {
            setQuestForm({
              title: '',
              description: '',
              type: 'main',
              objectives: [{ id: uuidv4(), description: '', completed: false }],
              obstacles: '',
              twists: '',
              rewards: '',
              consequences: '',
              progress: 0,
              status: 'available'
            });
            setShowQuestForm(true);
          }}>Add New Quest</button>
          
          <div className="quest-list">
            {activeArc.quests.map(quest => (
              <div key={quest.id} className="quest-card">
                <h4>{quest.title} ({quest.type})</h4>
                <p>Status: {quest.status}</p>
                <p>Progress: {quest.progress}%</p>
                <button onClick={() => editQuest(quest)}>Edit</button>
                <button onClick={() => deleteQuest(quest.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Arc Form */}
      {showArcForm && (
        <div className="arc-form">
          <h2>{activeArc ? 'Edit' : 'Create'} Plot Arc</h2>
          
          <label>
            Title:
            <input 
              type="text" 
              name="title" 
              value={arcForm.title}
              onChange={handleArcFormChange}
            />
          </label>
          
          <label>
            Description:
            <textarea 
              name="description" 
              value={arcForm.description}
              onChange={handleArcFormChange}
            />
          </label>
          
          <h3>Three-Act Structure</h3>
          <label>
            Act 1 (Setup):
            <textarea 
              name="act1" 
              value={arcForm.act1}
              onChange={handleArcFormChange}
            />
          </label>
          
          <label>
            Act 2 (Confrontation):
            <textarea 
              name="act2" 
              value={arcForm.act2}
              onChange={handleArcFormChange}
            />
          </label>
          
          <label>
            Act 3 (Resolution):
            <textarea 
              name="act3" 
              value={arcForm.act3}
              onChange={handleArcFormChange}
            />
          </label>
          
          <label>
            Consequences:
            <textarea 
              name="consequences" 
              value={arcForm.consequences}
              onChange={handleArcFormChange}
            />
          </label>
          
          <label>
            Progress (%):
            <input 
              type="number" 
              min="0" 
              max="100" 
              name="progress" 
              value={arcForm.progress}
              onChange={handleArcFormChange}
            />
          </label>
          
          <label>
            Status:
            <select 
              name="status" 
              value={arcForm.status}
              onChange={handleArcFormChange}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </label>
          
          <button onClick={activeArc ? updateArc : createArc}>
            {activeArc ? 'Update' : 'Create'} Arc
          </button>
          <button onClick={() => setShowArcForm(false)}>Cancel</button>
        </div>
      )}
      
      {/* Quest Form */}
      {showQuestForm && (
        <div className="quest-form">
          <h2>{questForm.id ? 'Edit' : 'Create'} Quest</h2>
          
          <label>
            Title:
            <input 
              type="text" 
              name="title" 
              value={questForm.title}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Description:
            <textarea 
              name="description" 
              value={questForm.description}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Type:
            <select 
              name="type" 
              value={questForm.type}
              onChange={handleQuestFormChange}
            >
              <option value="main">Main Quest</option>
              <option value="side">Side Quest</option>
            </select>
          </label>
          
          <h3>Objectives</h3>
          {questForm.objectives.map(obj => (
            <div key={obj.id} className="objective-item">
              <input
                type="checkbox"
                checked={obj.completed}
                onChange={() => toggleObjectiveCompletion(obj.id)}
              />
              <input
                type="text"
                value={obj.description}
                onChange={(e) => handleObjectiveChange(obj.id, e.target.value)}
                placeholder="Objective description"
              />
              <button onClick={() => removeObjective(obj.id)}>Remove</button>
            </div>
          ))}
          <button onClick={addObjective}>Add Objective</button>
          
          <label>
            Obstacles:
            <textarea 
              name="obstacles" 
              value={questForm.obstacles}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Twists:
            <textarea 
              name="twists" 
              value={questForm.twists}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Rewards:
            <textarea 
              name="rewards" 
              value={questForm.rewards}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Consequences:
            <textarea 
              name="consequences" 
              value={questForm.consequences}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Progress (%):
            <input 
              type="number" 
              min="0" 
              max="100" 
              name="progress" 
              value={questForm.progress}
              onChange={handleQuestFormChange}
            />
          </label>
          
          <label>
            Status:
            <select 
              name="status" 
              value={questForm.status}
              onChange={handleQuestFormChange}
            >
              <option value="available">Available</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </label>
          
          <button onClick={() => {
            const progress = calculateProgress(questForm.objectives);
            setQuestForm({ ...questForm, progress });
            if (questForm.id) {
              updateQuest(questForm.id);
            } else {
              createQuest();
            }
          }}>
            {questForm.id ? 'Update' : 'Create'} Quest
          </button>
          <button onClick={() => setShowQuestForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default QuestPlotArcManager;