import { Organization } from '../models/organization'

// Create a new organization
const createOrganization = async (req, res) => {
  try {
    const organization = new Organization({
      name: req.body.name,
      parent: req.body.parent
    });
    await organization.save();
    res.status(201).json(organization);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all organizations, sorted from top to bottom
const getOrganizations = (req, res) => {
  Organization.find({})
    .populate({
      path: 'parent',
      populate: {
        path: 'parent',
        populate: {
          path: 'parent',
          populate: {
            path: 'parent',
            populate: {
              path: 'parent'
            }
          }
        }
      }
    })
    .sort({ 'parent': 1 })
    .exec((err, organizations) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.json(organizations);
      }
    });
};

// get an organization and its children
const getOrgAndChildren = (req, res) => {
  const parentObjectId = req.params.parentId; // or wherever you get the parent object ID from
  Organization.find({ $or: [{ parent: parentObjectId }, { _id: parentObjectId }] })
    .populate('parent')
    .limit(10)
    .sort({ parent: 1 })
    .exec((err, organizations) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.json(organizations);
      }
    });
};

// get an org and its parents and children
const getOrgHierarchy = async (req, res) => {
  try {
    const orgId = req.params.id
    const org = await Organization.findById(orgId).populate('parent')
    const hierarchy = [org]

    let currentOrg = org
    while (currentOrg.parent) {
      const parentOrg = await Organization.findById(currentOrg.parent).populate('parent')
      hierarchy.unshift(parentOrg)
      currentOrg = parentOrg
    }

    const children = await Organization.find({ parent: orgId }).sort({ name: 1 })

    const updatedChildren = children.map(child => {
      child.name = "--" + child.name
      return child;
    });

    res.json([...hierarchy, ...updatedChildren ])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Get the root organization
const getRootOrganization = (req, res) => {
  console.log("getRootOrganization");
  Organization.findOne({ parent: null })
    .exec((err, organization) => {
      if (err) {
        console.error(err);
        res.status(500).json({ messagexx: err.message });
      } else if (!organization) {
        res.status(404).json({ message: 'Root organization not found' });
      } else {
        console.log("Successful")
        res.json([organization]);
      }
    });
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
    organization.parent = req.body.parent;
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
  deleteOrganization,
  getOrgHierarchy,
  getRootOrganization
};

// module.exports = {createOrganization};

