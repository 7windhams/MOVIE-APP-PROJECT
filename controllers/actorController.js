// Temporary mock data while you set up MySQL
const mockActors = [
    { actor_id: 1, actor_name: 'Tom Hanks', actor_birth_year: 1956, actor_nationality: 'American' },
    { actor_id: 2, actor_name: 'Leonardo DiCaprio', actor_birth_year: 1974, actor_nationality: 'American' },
    { actor_id: 3, actor_name: 'Meryl Streep', actor_birth_year: 1949, actor_nationality: 'American' }
];

const getAllActors = async (req, res) => {
    res.json(mockActors);
};

const getActorById = async (req, res) => {
    const { id } = req.params;
    const actor = mockActors.find(a => a.actor_id == id);
    
    if (!actor) {
        return res.status(404).json({ message: 'Actor not found' });
    }
    
    res.json(actor);
};

const getActorsSorted = async (req, res) => {
    const { sortBy = 'actor_name', order = 'ASC' } = req.query;
    
    let sortedActors = [...mockActors];
    
    if (sortBy === 'actor_name') {
        sortedActors.sort((a, b) => {
            return order === 'DESC' 
                ? b.actor_name.localeCompare(a.actor_name)
                : a.actor_name.localeCompare(b.actor_name);
        });
    }
    
    res.json(sortedActors);
};

const getActorsByNationality = async (req, res) => {
    const { nationality } = req.params;
    const filteredActors = mockActors.filter(actor => 
        actor.actor_nationality.toLowerCase().includes(nationality.toLowerCase())
    );
    
    res.json(filteredActors);
};

module.exports = {
    getAllActors,
    getActorById,
    getActorsSorted,
    getActorsByNationality
};