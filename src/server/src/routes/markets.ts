import { Router, Request, Response } from 'express';
import pool from '../database/db';

const router = Router();

// GET /api/markets - Get markets for a specific livestream
router.get('/', async (req: Request, res: Response) => {
  try {
    const { livestream_id } = req.query;

    if (!livestream_id) {
      return res.status(400).json({
        success: false,
        error: 'livestream_id parameter is required'
      });
    }

    // Get livestream with its associated market addresses
    const result = await pool.query(
      `SELECT market_ids, title, creator_wallet_address 
       FROM livestreams 
       WHERE id = $1`,
      [parseInt(livestream_id as string)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livestream not found'
      });
    }

    const livestream = result.rows[0];
    const marketIds = livestream.market_ids || [];
    
    return res.json({
      success: true,
      livestream: {
        id: livestream_id,
        title: livestream.title,
        creator: livestream.creator_wallet_address
      },
      market_addresses: marketIds
    });
  } catch (error) {
    console.error('Error fetching markets:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch markets'
    });
  }
});

// POST /api/markets - Store market metadata or associate with livestream
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      contract_address,
      livestream_id,
      creator_wallet_address,
      description,
      category,
      tags
    } = req.body;

    // Validate required fields
    if (!contract_address) {
      return res.status(400).json({
        success: false,
        error: 'contract_address is required'
      });
    }

    // If storing metadata
    if (creator_wallet_address) {
      // Store or update market metadata
      const result = await pool.query(
        `INSERT INTO market_metadata (contract_address, creator_wallet_address, description, category, tags)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (contract_address) 
         DO UPDATE SET 
           description = EXCLUDED.description,
           category = EXCLUDED.category,
           tags = EXCLUDED.tags,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [contract_address, creator_wallet_address, description, category, JSON.stringify(tags || [])]
      );

      return res.json({
        success: true,
        message: 'Market metadata stored successfully',
        metadata: result.rows[0]
      });
    }

    // If associating with livestream
    if (livestream_id) {
      // Check if livestream exists
      const livestreamResult = await pool.query(
        `SELECT id FROM livestreams WHERE id = $1`,
        [livestream_id]
      );

      if (livestreamResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Livestream not found'
        });
      }

      // Add market address to livestream's market_ids array
      await pool.query(
        `UPDATE livestreams 
         SET market_ids = 
           CASE 
             WHEN market_ids IS NULL THEN jsonb_build_array($1)
             ELSE market_ids || jsonb_build_array($1)
           END,
           updated_at = NOW()
         WHERE id = $2`,
        [contract_address, livestream_id]
      );

      return res.json({
        success: true,
        message: 'Market associated with livestream successfully'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Either creator_wallet_address (for metadata) or livestream_id (for association) is required'
    });

  } catch (error) {
    console.error('Error handling market request:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process market request'
    });
  }
});

// PUT /api/markets - Remove market association from livestream
router.put('/', async (req: Request, res: Response) => {
  try {
    const {
      contract_address,
      livestream_id,
      action // 'remove'
    } = req.body;

    if (!contract_address || !livestream_id) {
      return res.status(400).json({
        success: false,
        error: 'contract_address and livestream_id are required'
      });
    }

    if (action === 'remove') {
      // Remove market address from livestream's market_ids array
      await pool.query(
        `UPDATE livestreams 
         SET market_ids = market_ids - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [contract_address, livestream_id]
      );

      return res.json({
        success: true,
        message: 'Market removed from livestream'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid action. Use "remove" to remove market association'
    });
  } catch (error) {
    console.error('Error removing market association:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove market association'
    });
  }
});

export default router; 