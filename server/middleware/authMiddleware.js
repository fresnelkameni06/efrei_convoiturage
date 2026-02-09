module.exports = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      error: "Vous devez être connecté pour effectuer cette action"
    });
  }
  next();
};
