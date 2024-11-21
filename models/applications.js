import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const applicationResponses = sequelize.define('applicationResponses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  responseType: {
    type: DataTypes.ENUM('ACCEPTED', 'DENIED'),
    allowNull: false,
    validate: {
      isIn: [['ACCEPTED', 'DENIED']],
      notEmpty: {
        args: true,
        msg: 'responseType can not be empty',
      },
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'name can not be empty',
      },
      len: {
        args: [1, 255],
        msg: 'name must be between 1 and 255 characters',
      },
    },
  },
  abbr: {
    type: DataTypes.STRING(255),
    validate: {
      len: {
        args: [1, 5],
        msg: 'abbr must be between 1 and 5 characters',
      },
    },
  },
  responseText: {
    type: DataTypes.STRING(4095),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'response can not be empty',
      },
      len: {
        args: [1, 4095],
        msg: 'response must be between 1 and 4095 characters',
      },
    },
  },
});

export const applications = sequelize.define('applications', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  discordUserId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'discordUserId can not be empty',
      },
      len: {
        args: [17, 18],
        msg: 'discordUserId must be between 17 and 18 characters',
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'createdAt can not be empty',
      },
    },
  },
  submittedAt: {
    type: DataTypes.DATE,
  },
  state: {
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'DENIED'),
    allowNull: false,
    validate: {
      isIn: [['PENDING', 'ACCEPTED', 'DENIED']],
      notEmpty: {
        args: true,
        msg: 'state can not be empty',
      },
    },
  },
  responseId: {
    // foreign key
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customResponse: {
    type: DataTypes.STRING(4095),
    validate: {
      len: {
        args: [1, 4095],
        msg: 'customResponse must be between 1 and 4095 characters',
      },
    },
  },
});

export const applicationQuestions = sequelize.define('applicationQuestions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  question: {
    type: DataTypes.STRING(4095),
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'question can not be empty',
      },
      len: {
        args: [1, 4095],
        msg: 'question must be between 1 and 4095 characters',
      },
    },
  },
  order: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'order can not be empty',
      },
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

export const applicationQuestionsAnswers = sequelize.define(
  'applicationQuestionsAnswers',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    questionId: {
      // foreign key
      type: DataTypes.INTEGER,
    },
    applicationId: {
      // foreign key
      type: DataTypes.INTEGER,
    },
    answer: {
      type: DataTypes.STRING(4095),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'answer can not be empty',
        },
        len: {
          args: [1, 4095],
          msg: 'answer must be between 1 and 4095 characters',
        },
      },
    },
    // TODO: add extra data
  }
);

applications.hasMany(applicationResponses, { foreignKey: 'responseId' });
applicationResponses.belongsTo(applications, { foreignKey: 'responseId' });
applicationQuestions.hasMany(applicationQuestionsAnswers, {
  foreignKey: 'questionId',
});
applicationQuestionsAnswers.belongsTo(applicationQuestions, {
  foreignKey: 'questionId',
});
applications.hasMany(applicationQuestionsAnswers, {
  foreignKey: 'applicationId',
});
applicationQuestionsAnswers.belongsTo(applications, {
  foreignKey: 'applicationId',
});

// // Relationship between applications and applicationResponses
// applications.belongsTo(applicationResponses, {
//   foreignKey: 'responseId',
//   as: 'response'
// });
// applicationResponses.hasMany(applications, {
//   foreignKey: 'responseId',
//   as: 'applications'
// });

// // Relationship between applicationQuestionsAnswers and applicationQuestions
// applicationQuestionsAnswers.belongsTo(applicationQuestions, {
//   foreignKey: 'questionId',
//   as: 'question'
// });
// applicationQuestions.hasMany(applicationQuestionsAnswers, {
//   foreignKey: 'questionId',
//   as: 'answers'
// });

// // Relationship between applicationQuestionsAnswers and applications
// applicationQuestionsAnswers.belongsTo(applications, {
//   foreignKey: 'applicationId',
//   as: 'application'
// });
// applications.hasMany(applicationQuestionsAnswers, {
//   foreignKey: 'applicationId',
//   as: 'answers'
// });
