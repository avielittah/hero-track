import { Node, Edge } from 'reactflow';

export interface LearningNode {
  id: string;
  title: string;
  subtitle?: string;
  type: 'youtube' | 'article' | 'resource';
  url: string;
  children?: LearningNode[];
}

export const convertToFlowData = (
  learningMap: LearningNode[],
  completedNodes: Set<string>
) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let yPosition = 0;
  
  learningMap.forEach((topic, topicIndex) => {
    // Main topic node (centered)
    nodes.push({
      id: topic.id,
      type: 'roadmapNode',
      position: { x: 400, y: yPosition },
      data: {
        ...topic,
        isCompleted: completedNodes.has(topic.id),
        isMain: true,
      },
    });
    
    yPosition += 120;
    
    // Children nodes (3 columns below parent)
    if (topic.children) {
      const childrenPerRow = 3;
      const childWidth = 220;
      const childSpacing = 30;
      const totalWidth = childrenPerRow * childWidth + (childrenPerRow - 1) * childSpacing;
      const startX = 400 + childWidth/2 - totalWidth/2;
      
      topic.children.forEach((child, childIndex) => {
        const col = childIndex % childrenPerRow;
        const row = Math.floor(childIndex / childrenPerRow);
        
        nodes.push({
          id: child.id,
          type: 'roadmapNode',
          position: { 
            x: startX + col * (childWidth + childSpacing), 
            y: yPosition + row * 100 
          },
          data: {
            ...child,
            isCompleted: completedNodes.has(child.id),
            isMain: false,
          },
        });
        
        // Edge from parent to child
        edges.push({
          id: `${topic.id}-${child.id}`,
          source: topic.id,
          target: child.id,
          type: 'smoothstep',
          style: { 
            stroke: completedNodes.has(child.id) ? 'hsl(var(--primary))' : '#cbd5e1',
            strokeWidth: 2,
          },
        });
      });
      
      const rows = Math.ceil((topic.children.length) / childrenPerRow);
      yPosition += rows * 100 + 60;
    }
    
    // Connect to next main topic
    if (topicIndex < learningMap.length - 1) {
      edges.push({
        id: `${topic.id}-next`,
        source: topic.id,
        target: learningMap[topicIndex + 1].id,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: 'hsl(var(--primary))',
          strokeWidth: 3,
        },
      });
    }
  });
  
  return { nodes, edges };
};
