import { supabase } from './supabaseService';

/**
 * Get all tables in the database
 * @returns {Promise<Array>} - Array of table names
 */
export const getTables = async () => {
  try {
    // Query the information_schema to get all tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      throw new Error(`Error getting tables: ${error.message}`);
    }

    return data.map(table => table.table_name);
  } catch (error) {
    console.error('Error getting tables:', error);
    throw error;
  }
};

/**
 * Get all columns for a specific table
 * @param {string} tableName - Name of the table
 * @returns {Promise<Array>} - Array of column information
 */
export const getTableColumns = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    if (error) {
      throw new Error(`Error getting columns: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error(`Error getting columns for table ${tableName}:`, error);
    throw error;
  }
};

export default {
  getTables,
  getTableColumns
};
