import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as Blockly from 'blockly';
import { getToolboxForClass } from '@/lib/blockly/toolboxConfigs';
import '@/lib/blockly/customBlocks';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlocklyWorkspaceProps {
  classLevel: number;
  initialBlocks?: string;
  onChange?: (workspace: Blockly.Workspace) => void;
  onRun?: (blocks: any[]) => void;
  readOnly?: boolean;
}

export interface BlocklyWorkspaceRef {
  getWorkspace: () => Blockly.Workspace | null;
  getBlocks: () => any[];
  getBlocksXml: () => string;
  loadBlocksXml: (xml: string) => void;
  clear: () => void;
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, BlocklyWorkspaceProps>(
  ({ classLevel, initialBlocks, onChange, readOnly = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.Workspace | null>(null);
    const isMobile = useIsMobile();

    // Get blocks as serializable objects
    const getBlocks = useCallback((): any[] => {
      if (!workspaceRef.current) return [];

      const topBlocks = workspaceRef.current.getTopBlocks(true);
      return topBlocks.map(block => blockToJson(block));
    }, []);

    // Convert block to JSON representation
    const blockToJson = (block: Blockly.Block): any => {
      const json: any = {
        type: block.type,
        id: block.id,
        fields: {},
        inputs: {},
      };

      // Get field values
      block.inputList.forEach(input => {
        input.fieldRow.forEach(field => {
          if (field.name) {
            json.fields[field.name] = field.getValue();
          }
        });

        // Get input connections
        if (input.name && input.connection) {
          const connectedBlock = input.connection.targetBlock();
          if (connectedBlock) {
            json.inputs[input.name] = { block: blockToJson(connectedBlock) };
          }
        }
      });

      // Get next block
      const nextBlock = block.getNextBlock();
      if (nextBlock) {
        json.next = { block: blockToJson(nextBlock) };
      }

      return json;
    };

    // Get blocks as XML string
    const getBlocksXml = useCallback((): string => {
      if (!workspaceRef.current) return '';
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      return Blockly.Xml.domToText(xml);
    }, []);

    // Load blocks from XML string
    const loadBlocksXml = useCallback((xml: string): void => {
      if (!workspaceRef.current || !xml) return;
      try {
        workspaceRef.current.clear();
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
      } catch (err) {
        console.error('Failed to load blocks:', err);
      }
    }, []);

    // Clear workspace
    const clear = useCallback((): void => {
      if (workspaceRef.current) {
        workspaceRef.current.clear();
      }
    }, []);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getWorkspace: () => workspaceRef.current,
      getBlocks,
      getBlocksXml,
      loadBlocksXml,
      clear,
    }), [getBlocks, getBlocksXml, loadBlocksXml, clear]);

    // Initialize Blockly workspace
    useEffect(() => {
      if (!containerRef.current) return;

      const toolbox = getToolboxForClass(classLevel);

      // Kid-friendly theme
      const theme = Blockly.Theme.defineTheme('kidFriendly', {
        name: 'kidFriendly',
        base: Blockly.Themes.Classic,
        fontStyle: {
          family: 'Nunito, sans-serif',
          weight: 'bold',
          size: isMobile ? 11 : 12,
        },
        startHats: true,
      });

      const workspace = Blockly.inject(containerRef.current, {
        toolbox,
        theme,
        grid: {
          spacing: isMobile ? 15 : 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: isMobile ? 0.85 : 1.0,
          maxScale: 2,
          minScale: 0.4,
          scaleSpeed: 1.1,
        },
        trashcan: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true,
        },
        sounds: !isMobile, // Disable sounds on mobile for performance
        readOnly,
        renderer: 'zelos', // Rounded, kid-friendly look
        // Optimize for mobile touch
        ...(isMobile && {
          toolboxPosition: 'start',
        }),
      });

      workspaceRef.current = workspace;

      // Load initial blocks if provided
      if (initialBlocks) {
        try {
          const dom = Blockly.utils.xml.textToDom(initialBlocks);
          Blockly.Xml.domToWorkspace(dom, workspace);
        } catch (err) {
          console.error('Failed to load initial blocks:', err);
        }
      }

      // Listen for changes
      const changeListener = () => {
        if (onChange) {
          onChange(workspace);
        }
      };
      workspace.addChangeListener(changeListener);

      // Cleanup
      return () => {
        workspace.removeChangeListener(changeListener);
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, [classLevel, readOnly, isMobile]);

    // Update toolbox when class level changes
    useEffect(() => {
      if (workspaceRef.current) {
        const toolbox = getToolboxForClass(classLevel);
        const ws = workspaceRef.current as Blockly.WorkspaceSvg;
        if (ws.updateToolbox) {
          ws.updateToolbox(toolbox);
        }
      }
    }, [classLevel]);

    return (
      <div
        ref={containerRef}
        className="w-full h-full min-h-[180px] sm:min-h-[250px] lg:min-h-[400px] rounded-lg overflow-hidden border-2 border-border/50"
        style={{ 
          backgroundColor: '#f9f9f9',
          touchAction: 'none', // Improve touch handling
        }}
      />
    );
  }
);

BlocklyWorkspace.displayName = 'BlocklyWorkspace';

export default BlocklyWorkspace;
