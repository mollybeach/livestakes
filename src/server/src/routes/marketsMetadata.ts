import { Router, Request, Response } from 'express';
import pool from '../database/db';

const router = Router();

// GET /api/markets/metadata - Fetch all markets with metadata and filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, tags, creator, limit = '50', offset = '0' } = req.query;

    let query = `
      SELECT 
        mm.contract_address,
        mm.creator_wallet_address,
        mm.description,
        mm.category,
        mm.tags,
        mm.created_at,
        mm.updated_at
      FROM market_metadata mm
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    // Add filters
    if (category) {
      query += ` AND mm.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (tags) {
      // Filter by tags (supports comma-separated tags)
      const tagArray = (tags as string).split(',').map(t => t.trim()).filter(t => t);
      if (tagArray.length > 0) {
        query += ` AND mm.tags ?| $${paramIndex}`;
        params.push(tagArray);
        paramIndex++;
      }
    }

    if (creator) {
      query += ` AND mm.creator_wallet_address = $${paramIndex}`;
      params.push(creator);
      paramIndex++;
    }

    // Add ordering and pagination
    query += ` ORDER BY mm.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM market_metadata mm WHERE 1=1`;
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND mm.category = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }

    if (tags) {
      const tagArray = (tags as string).split(',').map(t => t.trim()).filter(t => t);
      if (tagArray.length > 0) {
        countQuery += ` AND mm.tags ?| $${countParamIndex}`;
        countParams.push(tagArray);
        countParamIndex++;
      }
    }

    if (creator) {
      countQuery += ` AND mm.creator_wallet_address = $${countParamIndex}`;
      countParams.push(creator);
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    return res.json({
      success: true,
      markets: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching markets metadata:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch markets metadata'
    });
  }
});

// GET /api/markets/metadata/tags - Get all unique tags
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT jsonb_array_elements_text(tags) as tag
      FROM market_metadata
      WHERE tags IS NOT NULL AND jsonb_array_length(tags) > 0
      ORDER BY tag
    `);

    const tags = result.rows.map(row => row.tag);

    return res.json({
      success: true,
      tags
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tags'
    });
  }
});

// GET /api/markets/metadata/categories - Get all unique categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category
      FROM market_metadata
      WHERE category IS NOT NULL
      ORDER BY category
    `);

    const categories = result.rows.map(row => row.category);

    return res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

export default router; 