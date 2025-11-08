import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RoadmapNode } from './RoadmapNode';
import { convertToFlowData, LearningNode } from './utils';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

interface RoadmapFlowProps {
  learningMap: LearningNode[];
  completedNodes: Set<string>;
  onToggleComplete: (id: string) => void;
}

export const RoadmapFlow = ({ 
  learningMap, 
  completedNodes, 
  onToggleComplete 
}: RoadmapFlowProps) => {
  // Convert data to flow format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => convertToFlowData(learningMap, completedNodes),
    [learningMap, completedNodes]
  );
  
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onToggleComplete,
        onNodeClick: (url: string) => window.open(url, '_blank'),
      }
    }))
  );
  
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes when completedNodes changes
  useMemo(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isCompleted: completedNodes.has(node.id),
        },
      }))
    );
  }, [completedNodes, setNodes]);
  
  // Calculate progress
  const totalNodes = learningMap.reduce((acc, node) => 
    acc + 1 + (node.children?.length || 0), 0
  );
  const completedCount = completedNodes.size;
  const progressPercentage = (completedCount / totalNodes) * 100;
  
  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Background */}
        <Background 
          color="hsl(var(--border))" 
          gap={20}
          size={1}
        />
        
        {/* Controls */}
        <Controls className="!bg-background !border-2 !border-border" />
        
        {/* Mini Map */}
        <MiniMap
          nodeColor={(node: any) => 
            node.data.isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
          }
          className="!bg-background !border-2 !border-border"
          maskColor="hsl(var(--muted) / 0.1)"
        />
        
        {/* Progress Tracker */}
        <Panel position="top-left" className="m-4">
          <Card className="p-4 min-w-[280px] bg-background/95 backdrop-blur shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Your Progress</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-semibold">
                  {completedCount} / {totalNodes}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  );
};
