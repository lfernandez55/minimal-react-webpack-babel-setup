import { Organization } from '../models/organization'

// Create a new organization
const createOrganization = async (req, res) => {
  try {
    const organization = new Organization({
      name: req.body.name,
      children: req.body.children
    });
    await organization.save();
    res.status(201).json(organization);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all organizations
const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get an organization by ID
const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an organization
const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    organization.name = req.body.name;
    organization.children = req.body.children;
    await organization.save();
    res.json(organization);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an organization
const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    await organization.remove();
    res.json({ message: 'Organization deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
};

// module.exports = {createOrganization};

