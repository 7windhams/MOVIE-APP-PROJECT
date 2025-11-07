// Temporary mock data while you set up MySQL
const mockDirectors = [
    { director_id: 1, director_name: 'Christopher Nolan', director_birth_year: 1970, director_nationality: 'British' },
    { director_id: 2, director_name: 'Steven Spielberg', director_birth_year: 1946, director_nationality: 'American' },
    { director_id: 3, director_name: 'Martin Scorsese', director_birth_year: 1942, director_nationality: 'American' }
];

const getAllDirectors = async (req, res) => {
    res.json(mockDirectors);
};

const getDirectorById = async (req, res) => {
    const directorId = req.params.id;
    const director = mockDirectors.find(d => d.director_id == directorId);
    
    if (!director) {
        return res.status(404).json({ message: 'Director not found' });
    }
    
    res.json(director);
};

// Get directors sorted by specific field
const getDirectorsSorted = async (req, res) => {
    try {
        const { sortBy = 'director_name', order = 'ASC' } = req.query;
        
        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['director_id', 'director_name', 'director_birth_year', 'director_nationality'];
        const validSortField = allowedSortFields.includes(sortBy) ? sortBy : 'director_name';
        const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [rows] = await pool.execute(
            `SELECT * FROM director ORDER BY ${validSortField} ${validOrder}`
        );
        
        res.json({
            success: true,
            count: rows.length,
            sortedBy: validSortField,
            order: validOrder,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching sorted directors:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sorted directors',
            message: error.message
        });
    }
};

// Custom endpoint: Get directors by birth year range
const getDirectorsByBirthYearRange = async (req, res) => {
    try {
        const { startYear, endYear } = req.query;
        
        if (!startYear || !endYear) {
            return res.status(400).json({
                success: false,
                error: 'Both startYear and endYear query parameters are required'
            });
        }
        
        const [rows] = await pool.execute(
            'SELECT * FROM director WHERE director_birth_year BETWEEN ? AND ? ORDER BY director_birth_year ASC, director_name ASC',
            [startYear, endYear]
        );
        
        res.json({
            success: true,
            birthYearRange: `${startYear} - ${endYear}`,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching directors by birth year range:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch directors by birth year range',
            message: error.message
        });
    }
};

module.exports = {
    getAllDirectors,
    getDirectorById,
    getDirectorsSorted,
    getDirectorsByBirthYearRange
};