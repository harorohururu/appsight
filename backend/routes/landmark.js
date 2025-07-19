

const express = require('express');
const router = express.Router();
const { LandmarkInfo, LandmarkType, ContactPerson } = require('../models');

// GET contacts for a specific landmark using raw SQL query
router.get('/contacts', async (req, res) => {
  try {
    const { landmark_info } = req.query;
    if (!landmark_info) {
      return res.status(400).json({ error: 'Missing landmark_info parameter' });
    }
    const [results] = await require('../models').sequelize.query(`
      SELECT * FROM contact_person WHERE landmark_info = ${parseInt(landmark_info)} ORDER BY contact_id ASC
    `);
    res.json(results);
    // Contacts fetched successfully
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
  }
});

// PUT update landmark
router.put('/landmarks/:id', async (req, res) => {
  // Edit landmark request
  try {
    const { name, landmark_type, address, total_rooms, attraction_code, contact_person } = req.body;
    const updateFields = {
      name,
      landmark_type: landmark_type ? parseInt(landmark_type) : null,
      address,
      total_rooms: total_rooms ? parseInt(total_rooms) : null,
      attraction_code,
      updated_at: new Date(),
    };
    const [affectedRows] = await require('../models').LandmarkInfo.update(updateFields, {
      where: { info_id: req.params.id },
    });
    // LandmarkInfo updated
    if (contact_person) {
      // Upsert contact person (delete old and add new, only fill selected type)
      await require('../models').ContactPerson.destroy({ where: { landmark_info: req.params.id } });
      let contactData = {
        name: contact_person.name,
        contact_type: contact_person.contact_type,
        value: contact_person.value,
        landmark_info: req.params.id,
        email: null,
        phone: null,
        telephone: null
      };
      if (contact_person.contact_type === 'email') {
        contactData.email = contact_person.value;
      } else if (contact_person.contact_type === 'phone') {
        contactData.phone = contact_person.value;
      } else if (contact_person.contact_type === 'telephone') {
        contactData.telephone = contact_person.value;
      }
      await require('../models').ContactPerson.create(contactData);
      // ContactPerson updated
    }
    res.json({ success: true });
    console.log('Landmark updated successfully');
  } catch (err) {
    console.error('Failed to update landmark:', err.message);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ error: 'Failed to update landmark', details: err.message });
  }
});
// GET all landmarks using raw SQL query
// GET all landmarks with joined landmark_type and contact_person
router.get('/landmarks', async (req, res) => {
  try {
    const [results] = await require('../models').sequelize.query(`
      SELECT li.*, lt.type_name, cp.contact_id, cp.name AS contact_name, cp.email, cp.phone, cp.telephone
      FROM landmark_info li
      LEFT JOIN landmark_type lt ON li.landmark_type = lt.type_id
      LEFT JOIN contact_person cp ON li.info_id = cp.landmark_info
      ORDER BY li.info_id DESC
    `);
    console.log('Landmarks shown successfully');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch landmarks', details: err.message });
  }
});
// GET all landmark types
router.get('/landmark_type', async (req, res) => {
  try {
    const types = await LandmarkType.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch landmark types' });
  }
});

// POST create new landmark
router.post('/landmarks', async (req, res) => {
  // Add landmark request
  try {
    const { name, landmark_type, address, total_rooms, attraction_code, contact_person } = req.body;
    // Creating LandmarkInfo
    const landmark = await LandmarkInfo.create({
      name,
      landmark_type: landmark_type ? parseInt(landmark_type) : null,
      address,
      total_rooms: total_rooms ? parseInt(total_rooms) : null,
      attraction_code,
      // created_at is handled by defaultValue: DataTypes.NOW
    });
    // LandmarkInfo created
    if (contact_person) {
      // Creating ContactPerson
          // Only fill the selected contact type, null others
          let contactData = {
            name: contact_person.name,
            contact_type: contact_person.contact_type,
            value: contact_person.value,
            landmark_info: landmark.info_id,
            email: null,
            phone: null,
            telephone: null
          };
          if (contact_person.contact_type === 'email') {
            contactData.email = contact_person.value;
          } else if (contact_person.contact_type === 'phone') {
            contactData.phone = contact_person.value;
          } else if (contact_person.contact_type === 'telephone') {
            contactData.telephone = contact_person.value;
          }
          await ContactPerson.create(contactData);
          // ContactPerson created
    }
    res.status(201).json(landmark);
    console.log('Landmark added successfully');
  } catch (err) {
    console.error('Failed to add landmark:', err.message);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ error: 'Failed to add landmark', details: err.message });
  }
});

  // DELETE a landmark and its contacts
router.delete('/landmarks/:id', async (req, res) => {
  try {
    const landmarkId = req.params.id;
    // Delete all contacts linked to this landmark using raw SQL
    const sequelize = require('../models').sequelize;
    try {
      await sequelize.query(`DELETE FROM contact_person WHERE landmark_info = ${parseInt(landmarkId)}`);
      const [result] = await sequelize.query(`DELETE FROM landmark_info WHERE info_id = ${parseInt(landmarkId)} RETURNING info_id`);
      if (result && result.length > 0) {
        console.log(`Landmark and contacts deleted successfully for landmark_id=${landmarkId}`);
        res.json({ success: true });
      } else {
        console.log(`Delete failed: landmark_id=${landmarkId} not found`);
        res.status(404).json({ error: 'Landmark not found' });
      }
    } catch (err) {
      console.error(`Delete failed for landmark_id=${landmarkId}:`, err.message);
      res.status(500).json({ error: 'Failed to delete landmark', details: err.message });
    }
  } catch (err) {
    console.error('Failed to delete landmark:', err.message);
    res.status(500).json({ error: 'Failed to delete landmark', details: err.message });
  }
});

module.exports = router;
