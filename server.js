const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root123",
  database: "netflix",
});

// Middleware to parse JSON requests
const app = express();
app.use(express.json());
app.use(bodyParser.json());

//Database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// CRUD operations
//for specific USER
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const queryString = `SELECT * from users where id = ?`;
    const [result] = await connection
    .promise()
    .query(queryString, [id]);

    if (results.length === 0) {
      res.status(404).send({message: "User not found",});
    }
    res.status(200).send({
      message: "Successfully get user",results});
  } catch (error) {
    console.log(error);
    res.status(500).send({message: "Error while getting user",error,});
  }
};
// When you get all users, then use paginations (limit, offset, and count)
const getUsers = async (req, res, next) => {
try {

  //limit and offset
    const { limit, offset } = req.query;
    const queryString =
    "SELECT * from users LIMIT ? OFFSET ?";
  const [results] = await connection
    .promise()
    .execute(queryString, [limit, offset]);

    //count
  const countQueryString = "SELECT COUNT(*) as count FROM users";
  const [countResults] = await connection
  .promise()
  .execute(countQueryString);

  const responseBody = {
    message: "Successfully got a Users_list",
    list: results,
    count: countResults[0].count,
  };

  res.status(200).send(responseBody);
} catch (err) {
  res.status(500).send({ message: "Internal Server Error" });
}
};

//create user using validation
const createUser = async (req, res, next) => {
 try {
  const { email_id, password, city, is_active } = req.body;

  const queryString = `
    INSERT INTO users
    (email_id, password, city, is_active)
    VALUES (?, ?, ?, ?)
  `;

  const [results] = await connection
    .promise()
    .execute(queryString, [email_id, password, city, is_active]);

  res.status(201).send({
    message: "User added successfully",
    results,
  });
} catch (error) {
  console.error(error);
  res.status(500).send({
    message: "Internal Server Error",
    error: error.message,  // Include the error message for better debugging
  });
}
};
//UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email_id, password, city, is_active } = req.body;

    const queryString = 
    'UPDATE users SET email_id = ?, password = ?, city = ?, is_active = ? WHERE id = ?';

    const [result] = await connection

      .promise()

      .query(queryString, [email_id, password, city, is_active, id]);

    if (result.affectedRows === 0) {

      res.status(404).send({message: "User not found",});

    } else {
      res.status(200).send({message: "User updated successfully",result,});
          }

  } catch (error) {
    console.error(error);
    res.status(500).send({message: "Error while updating user",error: error.message,});
  }
};
//DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    let queryString ='DELETE from users WHERE id = ?';

    const [result] = await connection
    .promise()
    .query(queryString, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "User not found",
      });
    } else {
      res.status(200).send({
        message: "User deleted successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting user",
      error,
    });
  }
};
 app.get("/users/:id", getUser);
app.get("/users", getUsers);
 app.post("/users", createUser);//new user
 app.put("/users/:id", updateUser);
 app.delete("/users/:id",deleteUser);

//Table profiles
//for one profile
const getProfiles = async (req, res) => {
  try {
    const { id } = req.params;

    // console.log(req);
    let queryString = `SELECT * from profiles where id = ?`;
    const [result] = await connection.promise().execute(queryString, [id]);
    if (result.length === 0) {
      res.status(404).send({
        message: "profile not found",
      });
    } else {
      res.status(200).send({
        message: "Successfully get profile",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting profile",
      error,
    });
  }
};

//create new profile
const createProfiles = async (req, res) => {
  try {
    const { name, type, user_id } = req.body;

    let queryString = `INSERT INTO profiles (name, type, user_id)
    VALUES (?, ?, ?)`;
    const [results] = await connection
      .promise()
      .execute(queryString,[name, type, user_id]);

    res.status(201).send({
      message: "Profile created successfully",results});
  } catch (error) {
    console.log(error);
    res.status(500).send({message: "Error while creating Profile",error});
  }
};
//update profile
const updateProfiles = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, user_id } = req.body;
    const queryString = `UPDATE profiles SET name = ?,type=?, user_id=? WHERE id = ?`;
    const [results] = await connection
      .promise()
      .query(queryString, [ name, type,user_id, id]);
    if (results.affectedRows === 0) {
      res.status(404).send({message: "profile not found"});
    } 
    else {
      res.status(200).send({message: "profile updated Succesfully",results});
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({message: "Error while updating profile",error});
  }
};

//get all profiles(limit,offset,count,join)
const getAllProfiles = async (req, res) => {
  const { limit, offset, sort } = req.query;

  // Check if user_id is provided
  const user_id = req.query;
  if (!user_id) {
    return res.status(400).json({
      message: "userID not found",
    });
  }
try {
    const queryString = `
      SELECT users.name,user.gender,user.is_active
      FROM users
      INNER JOIN wishlists ON users.id = .user_id
      WHERE wishlists.user_id =?
    `;

    const [results] = await connection
    .promise()
    .execute(queryString, [user_id, limit, offset]);
//count
    const countQueryString = `SELECT COUNT(id) AS count FROM profiles WHERE user_id = ?`;

    const [countResult] = await connection
    .promise()
    .execute(countQueryString, [user_id]);

    const responseBody = {
      message: "Successfully got all profiles",
      list: results,
      count: countResult[0].count,
    };

    res.status(200).json(responseBody);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while getting profiles",
      error: error.message,
    });
  }
};

const deleteProfiles = async (req, res) => {
  try {
    const { id } = req.params;
    let queryString = `DELETE from profiles WHERE user_id = ?`;
    const [result] = await connection.promise().execute(queryString, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Profiles not found",
      });
    } else {
      res.status(200).send({
        message: "Profiles deleted successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting Profiles",
      error,
    });
  }
};
app.get("/profiles/:id", getProfiles);
app.get("/profiles", getAllProfiles);
app.post("/profiles", createProfiles);
app.put("/profiles/:id", updateProfiles);
app.delete("/profiles/:id", deleteProfiles);

//Table videos
//Get all videos
const getAllVideos = async (req, res) => {
  const { limit, offset, sort } = req.query;
  const queryData = req.query;
  
  // Validate is_active
  
  try {
    let queryString = `SELECT id, title, description, created_at FROM videos ORDER BY id ${sort} LIMIT ? OFFSET ?`;
    const [result] = await connection
      .promise()
      .execute(queryString, [limit, offset]);

    let countQueryString = `SELECT COUNT(id) AS count FROM videos WHERE id= ?`;
    const [countResult] = await connection
      .promise()
      .execute(countQueryString, [is_active]);

    const responseBody = {
      message: "Successfully got all videos",
      list: result,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error while getting videos",
      error,
    });
  }
};

//get specific VIDEO
const getVideo= async (req, res) => {
  try {
    const { id } = req.params;

    
    let queryString = `SELECT * from contents where id = ?`;
    const [results] = await connection.promise().execute(queryString, [id]);
    if (results.length === 0) {
      res.status(404).send({
        message: "video not found",
      });
    } else {
      res.status(200).send({
        message: "Successfully got video",
        results,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting video",
      error,
    });
  }
};

//CREATE VIDEO
const createVideo = async (req, res) => {
  try {
    const { title,description,is_active,user_id,cast_id } = req.body;

    let queryString = `INSERT INTO videos (title,description,is_active,user_id,cast_id)
    VALUES (?, ?, ?, ?)`;
    const [results] = await conn
      .promise()
      .execute(queryString, [
        title,
        description,
        type,
        is_active,
      ]);

    res.status(201).send({
      message: "Video created successfully",
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while creating Video",
      error,
    });
  }
};

//UPDATE VIDEO
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, is_active } = req.body;
    let queryString = `UPDATE contents SET title = ?,description =?, type=?,  is_active =? WHERE id = ?`;
    const [results] = await conn
      .promise()
      .execute(queryString, [
        title,
        description,
        type,
        is_active,
        id,
      ]);
    if (results.affectedRows === 0) {
      res.status(404).send({
        message: "Video not found",
      });
    } else {
      res.status(200).send({
        message: "Video updated Succesfully",
        results
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating video",
      error
    });
  }
};

//DELETE VIDEO
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    let queryString = `DELETE from contents WHERE id = ?`;
    const [results] = await connection.promise().execute(queryString, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Video not found",
      });
    } else {
      res.status(200).send({
        message: "Video deleted successfully",
        results
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting Video",
      error,
    });
  }
};


app.get("/videos", getAllVideos);
app.get("/videos/:id", getVideo);
app.post("/videos", createVideo);
app.put("/videos/:id", updateVideo);
app.delete("/videos/:id", deleteVideo);
//Table actors
//GET ALL ACTORS

//limit,offset,
const getAllActors = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    let queryString = `SELECT id, name, created_at, updated_at FROM actors LIMIT ? OFFSET ?`;

    const [results] = await connection
      .promise()
      .execute(queryString, [ limit, offset]);

    let countQueryString = `SELECT count(id) as count from actors`;
    const [countResult] = await connection
      .promise()
      .execute(countQueryString);

    const responseBody = {
      message: "Successfully got all Actors",
      list: results,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting Actors",
      error,
    });
  }
};

//GET SINGLE ACTORS
const getActors = async (req, res) => {
  try {
    const { id } = req.params;

    // console.log(req);
    let queryString = `SELECT * from actors where id = ?`;
    
    const [result] = await connection
    .promise().execute(queryString, [id]);
    if (result.length === 0) {
      res.status(404).send({
        message: "Actors not found",
      });
    } else {
      res.status(200).send({
        message: "Successfully got Actors",
        result
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting actors",
      error
    });
  }
};

//CREATE ACTORS
const createActors = async (req, res) => {
  try {
    const { name } = req.body;

    let queryString = `INSERT INTO actors (name) VALUES (?)`;
    const [results] = await connection
      .promise()
      .query(queryString, [name]);

    res.status(201).send({
      message: "Actor created successfully",
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while creating Actor",
      error,
    });
  }
};

//UPDATE ACTORS
const updateActors = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let queryString = `UPDATE actors SET name = ? WHERE id = ?`;
    const [results] = await connection
      .promise()
      .execute(queryString, [name,id]);
    if (results.affectedRows === 0) {
      res.status(404).send({
        message: "Actor not found",
      });
    } else {
      res.status(200).send({
        message: "Actor updated Succesfully",
        results,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating actor",
      error,
    });
  }
};

// //DELETE ACTORS
const deleteActors = async (req, res) => {
  try {
    const { id } = req.params;
    let queryString = `DELETE from actors WHERE id = ?`;
    const [results] = await connection.promise().execute(queryString, [id]);
    if (results.affectedRows === 0) {
      res.status(404).send({
        message: "Actor not found",
      });
    } else {
      res.status(200).send({
        message: "Actor deleted successfully",
        results,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting actor",
      error,
    });
  }
};
 app.get("/actors", getAllActors);
app.get("/actors/:id", getActors);
 app.post("/actors", createActors);
app.put("/actors/:id", updateActors);
app.delete("/actors/:id", deleteActors);

//Table Casts
//GET ALL CASTS
const getAllCasts = async (req, res) => {
  const { limit, offset } = req.query;
  // console.log(req.headers);
  const queryData = req.query;
  let actor_id = queryData.actor_id;
  if (!actor_id) {
    res.status(400).send({
      message: "This Actor is not available",
    });
  }

  try {
    let queryString = `SELECT casts.id, actors.name, videos.title, casts.created_at
    FROM casts
    JOIN actors ON casts.actor_id = actors.id
    JOIN videos ON casts.videos_id = videos.id WHERE actor_id =? order by id LIMIT ? OFFSET ? `;
    const [result] = await conn
      .promise()
      .execute(queryString, [actor_id, limit, offset]);

    let countQueryString = `SELECT count(id) as count from casts WHERE actor_id = ?`;
    const [countResult] = await confirm
      .promise()
      .execute(countQueryString, [actor_id]);

    const responseBody = {
      message: "Successfully got all Casts",
      list: result,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
    // console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting Casts",
      error,
    });
  }
};

//GET SINGLE CASTS
const getCasts = async (req, res) => {
  try {
    const { id } = req.params;

    
    let queryString = `SELECT actor_id from casts where id = ?`;
    const [result] = await connection.promise().execute(queryString, [id]);

    if (result.length === 0) {
      res.status(404).send({
        message: "cast not found",
      });
    }
    res.status(200).send({
      message: "Successfully retrieved cast",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting cast",
      error,
    });
  }
};

//CREATE CASTS
const createCasts = async (req, res) => {
  try {
    const { actor_id } = req.body;

    let queryString = `INSERT INTO casts (actor_id) VALUES (?)`;
    const [result] = await connection
      .promise()
      .query(queryString, [actor_id]);

    res.status(201).send({
      message: "Actor created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while creating Actor",
      error,
    });
  }
};

//UPDATE CASTS
const updateCasts = async (req, res) => {
  try {
    const { id } = req.params;
    const { actor_id } = req.body;
    let queryString = `UPDATE casts SET actor_id = ? WHERE id = ?`;
    const [result] = await connection
      .promise()
      .execute(queryString, [actor_id, id]);
    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Casts not found",
      });
    } else {
      res.status(200).send({
        message: "Casts updated successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating casts",
      error,
    });
  }
};

// //DELETE CASTS
const deleteCasts = async (req, res) => {
  try {
    const { id } = req.params;
    let queryString = `DELETE from casts WHERE id = ?`;
    const [result] = await connection.promise().execute(queryString, [id]);
    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "casts not found",
      });
    } else {
      res.status(200).send({
        message: "casts deleted successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting actor",
      error,
    });
  }
};
app.get("/casts", getAllCasts);
 //app.get("/casts/:id", getCasts);
//app.post("/casts", createCasts);
//app.put("/casts/:id", updateCasts);
//app.delete("/casts/:id", deleteCasts);

const getAllVideoStatus = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM videostatus');
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while retrieving video statuses",
      error,
    });
  }
};

// Get video status by ID
const getVideoStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await connection.query('SELECT * FROM videostatus WHERE id = ?', [id]);

    if (rows.length === 0) {
      res.status(404).send({
        message: "Video status not found",
      });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while retrieving video status by ID",
      error,
    });
  }
};

// Create a new video status
const createVideoStatus = async (req, res) => {
  try {
    const { type,user_id } = req.body;
    const [result] = await connection.execute(
      'INSERT INTO videostatus (type, user_id) VALUES (?, ?)',
      [type,user_id]
    );

    res.status(201).send({
      message: "Video status created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while creating video status",
      error,
    });
  }
};

// Update video status by ID
const updateVideoStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, release_date } = req.body;
    const [result] = await connection.execute(
      'UPDATE video_status SET title = ?, description = ?, type = ?, release_date = ? WHERE id = ?',
      [title, description, type, release_date, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Video status not found",
      });
    } else {
      res.status(200).send({
        message: "Video status updated successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating video status",
      error,
    });
  }
};

// Delete video status by ID
const deleteVideoStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute('DELETE FROM videostatus WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Video status not found",
      });
    } else {
      res.status(200).send({
        message: "Video status deleted successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting video status",
      error,
    });
  }
};

// Routes
app.get('/videostatus', getAllVideoStatus);
app.get('/videostatus/:id', getVideoStatusById);
app.post('/videostatus', createVideoStatus);
app.put('/videostatus/:id', updateVideoStatusById);
app.delete('/videostatus/:id', deleteVideoStatusById);


const getAllWatchedLists = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM watchedlist');
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while retrieving watched lists",
      error,
    });
  }
};

// Get watched list by ID
const getWatchedListById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await connection.query('SELECT * FROM watchedlist WHERE id = ?', [id]);

    if (rows.length === 0) {
      res.status(404).send({
        message: "Watched list not found",
      });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while retrieving watched list by ID",
      error,
    });
  }
};

// Create a new watched list
const createWatchedList = async (req, res) => {
  try {
    const { last_watch, user_id, videostatus_id } = req.body;
    const [result] = await connection.execute(
      'INSERT INTO watchedlist (last_watch, user_id, videostatus_id) VALUES (?, ?, ?)',
      [last_watch, user_id, videostatus_id]
    );

    res.status(201).send({
      message: "Watched list created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while creating watched list",
      error,
    });
  }
};

// Update watched list by ID
const updateWatchedListById = async (req, res) => {
  try {
    const { id } = req.params;
    const { last_watch, user_id, videostatus_id } = req.body;
    const [result] = await connection.execute(
      'UPDATE watchedlist SET last_watch = ?, user_id = ?, videostatus_id = ? WHERE id = ?',
      [last_watch, user_id, videostatus_id]
    );

    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Watched list not found",
      });
    } else {
      res.status(200).send({
        message: "Watched list updated successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating watched list",
      error,
    });
  }
};

// Delete watched list by ID
const deleteWatchedListById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute('DELETE FROM watchedlist WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).send({
        message: "Watched list not found",
      });
    } else {
      res.status(200).send({
        message: "Watched list deleted successfully",
        result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting watched list",
      error,
    });
  }
};

// Routes
app.get('/watchedlists', getAllWatchedLists);
app.get('/watchedlists/:id', getWatchedListById);
app.post('/watchedlists', createWatchedList);
app.put('/watchedlists/:id', updateWatchedListById);
app.delete('/watchedlists/:id', deleteWatchedListById);


app.listen(3000, console.log("server started"));