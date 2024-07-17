DECLARE @qryString VARCHAR(100) = 'spec';

SELECT 
    obj.name AS FunctionName,
	    params.parameter_id AS ParameterID,
    params.name AS ParameterName,
    SCHEMA_NAME(obj.schema_id) AS SchemaName,
    obj.type_desc AS FunctionType,
    obj.create_date AS CreationDate,
    obj.modify_date AS LastModifiedDate,

    params.parameter_id AS ParameterOrder,
    params.system_type_id AS SystemTypeID,
    types.name AS SystemTypeName,
    params.max_length AS MaxLength,
    params.precision AS Precision,
    params.scale AS Scale,
    params.is_output AS IsOutput
FROM 
    sys.objects AS obj
JOIN 
    sys.parameters AS params ON obj.object_id = params.object_id
JOIN 
    sys.types AS types ON params.system_type_id = types.system_type_id
WHERE 
    obj.type IN ('FN', 'IF', 'TF', 'FS', 'FT')
    AND obj.name LIKE CONCAT('%', @qryString, '%')
    -- 'FN' stands for SQL scalar function
    -- 'IF' stands for SQL inline table-valued function
    -- 'TF' stands for SQL table-valued-function
    -- 'FS' stands for Assembly (CLR) scalar-function
    -- 'FT' stands for Assembly (CLR) table-valued function
ORDER BY 
    SchemaName, FunctionName, ParameterOrder;
