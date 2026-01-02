import migrate from '../db/migrate-wordpress-simple.js';

/**
 * API endpoint to trigger WordPress posts migration
 * 
 * POST /api/migrate - Run the migration
 * 
 * Note: In production, you should protect this endpoint with authentication
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    console.log('Migration endpoint called');
    const result = await migrate();
    
    if (result.success) {
      res.status(200).json({
        message: 'Migration completed successfully',
        migrated: result.migrated,
        errors: result.errors || 0,
      });
    } else {
      res.status(500).json({
        error: 'Migration failed',
        message: result.error,
      });
    }
  } catch (error) {
    console.error('Migration endpoint error:', error);
    res.status(500).json({
      error: 'Migration failed',
      message: error.message,
    });
  }
}
