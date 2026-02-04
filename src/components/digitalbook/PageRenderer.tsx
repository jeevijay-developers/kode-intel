import { TextBlock } from "./ContentBlocks/TextBlock";
import { ImageBlock } from "./ContentBlocks/ImageBlock";
import { CalloutBlock } from "./ContentBlocks/CalloutBlock";
import { BlockVisualBlock } from "./ContentBlocks/BlockVisualBlock";
import { DividerBlock } from "./ContentBlocks/DividerBlock";
import { ActivityBlock } from "./ContentBlocks/ActivityBlock";

interface ContentBlock {
  id: string;
  block_type: string;
  content: unknown;
  order_index: number;
}

interface PageRendererProps {
  blocks: ContentBlock[];
}

export function PageRenderer({ blocks }: PageRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="space-y-2">
      {sortedBlocks.map((block) => {
        switch (block.block_type) {
          case "text":
            return <TextBlock key={block.id} content={block.content as any} />;
          case "image":
            return <ImageBlock key={block.id} content={block.content as any} />;
          case "callout":
            return <CalloutBlock key={block.id} content={block.content as any} />;
          case "block_visual":
            return <BlockVisualBlock key={block.id} content={block.content as any} />;
          case "divider":
            return <DividerBlock key={block.id} content={block.content as any} />;
          case "activity":
            return <ActivityBlock key={block.id} content={block.content as any} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
