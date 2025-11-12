// Placeholder mail service. Wire up real transport later.

const queueTransactionalMail = async ({ to, template, data }) => {
  console.log("Mail queued", { to, template, data });
  return true;
};

module.exports = {
  queueTransactionalMail,
};
