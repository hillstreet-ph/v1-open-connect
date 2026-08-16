
ALTER TABLE resources DROP CONSTRAINT resources_resource_type_check;
ALTER TABLE resources ADD CONSTRAINT resources_resource_type_check 
  CHECK (resource_type = ANY (ARRAY['agent','plugin','mcp','prompt','tool','skill']));
