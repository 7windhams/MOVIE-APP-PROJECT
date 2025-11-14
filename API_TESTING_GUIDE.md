# Movie Database API Testing Guide

## Overview
This document provides comprehensive testing instructions for the Movie Database API endpoints and web forms.

## API Endpoints

### Base URL: `http://localhost:3002`

### Actor Endpoints

#### 1. Create Actor (POST)
**Endpoint:** `POST /api/actors`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "actor_name": "Emma Stone",
  "actor_birth_year": 1988,
  "actor_nationality": "American"
}
```

#### 2. Update Actor (PATCH)
**Endpoint:** `PATCH /api/actors/:id`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "actor_name": "Emma Stone",
  "actor_birth_year": 1988,
  "actor_nationality": "American"
}
```

### Director Endpoints

#### 3. Create Director (POST)
**Endpoint:** `POST /api/directors`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "director_name": "Greta Gerwig",
  "director_birth_year": 1983,
  "director_nationality": "American"
}
```

#### 4. Update Director (PATCH)
**Endpoint:** `PATCH /api/directors/:id`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "director_name": "Greta Gerwig",
  "director_birth_year": 1983,
  "director_nationality": "American"
}
```

### Genre Endpoints

#### 5. Create Genre (POST)
**Endpoint:** `POST /api/genres`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "genre_name": "Romance",
  "genre_description": "Films that focus on love stories and romantic relationships between characters."
}
```

#### 6. Update Genre (PATCH)
**Endpoint:** `PATCH /api/genres/:id`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "genre_name": "Romantic Comedy",
  "genre_description": "Films that combine romantic storylines with comedic elements."
}
```

### Production Company Endpoints

#### 7. Create Production (POST)
**Endpoint:** `POST /api/productions`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "production_name": "A24",
  "production_founded_year": 2012,
  "production_headquarters": "New York City, New York"
}
```

#### 8. Update Production (PATCH)
**Endpoint:** `PATCH /api/productions/:id`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "production_name": "A24 Films",
  "production_founded_year": 2012,
  "production_headquarters": "New York City, New York"
}
```

### Movie Endpoints

#### 9. Create Movie (POST)
**Endpoint:** `POST /api/movies`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "movie_title": "La La Land",
  "movie_release_year": 2016,
  "movie_runtime": 128,
  "movie_rating": 8.0,
  "director_id": 1,
  "production_id": 2
}
```

#### 10. Update Movie (PATCH)
**Endpoint:** `PATCH /api/movies/:id`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "movie_title": "La La Land",
  "movie_release_year": 2016,
  "movie_runtime": 128,
  "movie_rating": 8.0,
  "director_id": 1,
  "production_id": 2
}
```

## Postman Testing Collection

### Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:3002`
- `actorId`: (will be set after creating an actor)
- `directorId`: (will be set after creating a director)
- `genreId`: (will be set after creating a genre)
- `productionId`: (will be set after creating a production)
- `movieId`: (will be set after creating a movie)

### Test Collection Structure

#### Folder 1: Actors
1. **Create Actor** 
   - Method: POST
   - URL: `{{baseUrl}}/api/actors`
   - Test Script: Save actor_id to environment
   ```javascript
   if (pm.response.code === 201) {
       const response = pm.response.json();
       pm.environment.set("actorId", response.actor.actor_id);
   }
   ```

2. **Get All Actors**
   - Method: GET
   - URL: `{{baseUrl}}/api/actors`

3. **Get Actor by ID**
   - Method: GET
   - URL: `{{baseUrl}}/api/actors/{{actorId}}`

4. **Update Actor**
   - Method: PATCH
   - URL: `{{baseUrl}}/api/actors/{{actorId}}`

#### Folder 2: Directors
1. **Create Director** (similar structure as actors)
2. **Get All Directors**
3. **Get Director by ID**
4. **Update Director**

#### Folder 3: Genres
1. **Create Genre**
2. **Get All Genres**
3. **Get Genre by ID**
4. **Update Genre**

#### Folder 4: Production Companies
1. **Create Production**
2. **Get All Productions**
3. **Get Production by ID**
4. **Update Production**

#### Folder 5: Movies
1. **Create Movie** (uses saved director and production IDs)
2. **Get All Movies**
3. **Get Movie by ID**
4. **Update Movie**

## Web Forms Testing

### Form URLs
- **Forms Index**: `http://localhost:3002/forms`
- **Add Actor**: `http://localhost:3002/forms/actor`
- **Add Director**: `http://localhost:3002/forms/director`
- **Add Genre**: `http://localhost:3002/forms/genre`
- **Add Production**: `http://localhost:3002/forms/production`
- **Add Movie**: `http://localhost:3002/forms/movie`

### Edit Forms (replace :id with actual ID)
- **Edit Actor**: `http://localhost:3002/forms/actor/:id`
- **Edit Director**: `http://localhost:3002/forms/director/:id`
- **Edit Genre**: `http://localhost:3002/forms/genre/:id`
- **Edit Production**: `http://localhost:3002/forms/production/:id`
- **Edit Movie**: `http://localhost:3002/forms/movie/:id`

## Testing Scenarios

### 1. Complete Actor Lifecycle
1. Create actor via API
2. Verify creation via GET endpoint
3. Update actor via PATCH
4. Verify update via web interface
5. Edit actor via web form

### 2. Movie with Relationships
1. Create director via API
2. Create production company via API
3. Create movie referencing both
4. Verify all relationships via GET endpoints

### 3. Form Validation
1. Test required field validation
2. Test optional field handling
3. Test dropdown selections
4. Test numeric field validation

### 4. Error Handling
1. Test creating with missing required fields
2. Test updating non-existent records
3. Test invalid data types

## Expected Responses

### Success Responses
- **201 Created**: For successful POST operations
- **200 OK**: For successful GET and PATCH operations

### Success Response Format
```json
{
  "message": "Actor created successfully",
  "actor": {
    "actor_id": 1,
    "actor_name": "Emma Stone",
    "actor_birth_year": 1988,
    "actor_nationality": "American"
  }
}
```

### Error Responses
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Record not found
- **500 Internal Server Error**: Database or server errors

### Error Response Format
```json
{
  "message": "Error creating actor",
  "error": "Actor name is required"
}
```

## Database Verification

After testing, you can verify data in the database using:
```bash
curl http://localhost:3002/api/actors
curl http://localhost:3002/api/directors
curl http://localhost:3002/api/genres
curl http://localhost:3002/api/productions
curl http://localhost:3002/api/movies
```

Or visit the web interface:
- `http://localhost:3002/actors`
- `http://localhost:3002/directors`
- `http://localhost:3002/genres`
- `http://localhost:3002/productions`
- `http://localhost:3002/movies`