const { IAMClient, ListUsersCommand, ListRolesCommand, ListGroupsCommand, ListPoliciesCommand } = require('@aws-sdk/client-iam');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { accessKeyId, secretAccessKey, region } = req.body;

  // Configure AWS SDK v3 with user-provided credentials
  const iamClient = new IAMClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  try {
    // Fetch IAM data concurrently
    const [usersData, rolesData, groupsData, policiesData] = await Promise.all([
      iamClient.send(new ListUsersCommand({})),
      iamClient.send(new ListRolesCommand({})),
      iamClient.send(new ListGroupsCommand({})),
      iamClient.send(new ListPoliciesCommand({ Scope: 'Local' })),
    ]);

    // Format data response
    const responseData = [
      ...usersData.Users.map(user => ({
        resourceType: 'Identity',
        resourceName: user.UserName,
        resourceId: user.UserId,
        creationDate: user.CreateDate,
      })),
      ...rolesData.Roles.map(role => ({
        resourceType: 'Role',
        resourceName: role.RoleName,
        resourceId: role.RoleId,
        creationDate: role.CreateDate,
      })),
      ...groupsData.Groups.map(group => ({
        resourceType: 'Group',
        resourceName: group.GroupName,
        resourceId: group.GroupId,
        creationDate: group.CreateDate,
      })),
      ...policiesData.Policies.map(policy => ({
        resourceType: 'Policy',
        resourceName: policy.PolicyName,
        resourceId: policy.PolicyId,
        creationDate: policy.CreateDate,
      })),
    ];

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching IAM data:", error);
    res.status(500).json({ error: 'Error fetching IAM data', details: error.message });
  }
});

module.exports = router;
