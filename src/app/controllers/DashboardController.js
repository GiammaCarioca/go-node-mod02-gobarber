const moment = require('moment')
const { Op } = require('sequelize')

const { Appointment, User } = require('../models')

class DashboardController {
  async index (req, res) {
    const { name: providerName, provider } = res.locals.user
    const { id } = req.session.user

    if (provider) {
      const appointments = await Appointment.findAll({
        include: [{ model: User, as: 'user' }],
        where: {
          provider_id: id,
          date: {
            [Op.between]: [
              moment()
                .startOf('day')
                .format(),
              moment()
                .endOf('day')
                .format()
            ]
          }
        }
      })

      return res.render('dashboard/provider', {
        providerName,
        appointments
      })
    }
    const providers = await User.findAll({ where: { provider: true } })

    return res.render('dashboard/client', { providers })
  }
}
module.exports = new DashboardController()
