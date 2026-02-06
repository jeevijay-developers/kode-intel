-- Add new block types to the content_block_type enum
ALTER TYPE public.content_block_type ADD VALUE IF NOT EXISTS 'step_by_step';
ALTER TYPE public.content_block_type ADD VALUE IF NOT EXISTS 'key_term';
ALTER TYPE public.content_block_type ADD VALUE IF NOT EXISTS 'comparison';