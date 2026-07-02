/* Check if the user exists and whether their role is allowed
Restricts users based on roles
*/
const role = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do this" });
    }

    next();
  };
};

module.exports = role;
