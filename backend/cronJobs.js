const cron = require("node-cron");
const Account = require("./models/accountModel");
const Contract = require("./models/contractModel");
const Estate = require("./models/estateModel");
const Revenue = require("./models/revenueModel");
const Expense = require("./models/expenseModel");
const ScheduledMission = require("./models/scheduledMissionModel");
const { sendWAText } = require("./utils/sendWAMessage");
const sendEmail = require("./utils/sendEmail");
const { subscriptionExpirationHtml } = require("./utils/htmlMessages");
const { formatSaudiNumber } = require("./utils/formatNumbers");

let isTaskRunning = false;

const checkScheduledMissions = async () => {
  console.time("checkScheduledMissions");

  if (isTaskRunning) {
    console.timeEnd("checkScheduledMissions");
    return;
  }

  isTaskRunning = true;
  try {
    const missions = await ScheduledMission.find({
      isDone: false,
      scheduledAt: { $lte: new Date() },
    }).lean();

    if (missions.length === 0) {
      console.log("No scheduled missions to process.");
      return;
    }

    const promises = [];
    const missionsIds = [];
    const contractBulkUpdates = [];
    const estateBulkUpdates = [];

    missions.forEach((task) => {
      missionsIds.push(task._id);

      if (task.type === "CONTRACT_EXPIRATION") {
        contractBulkUpdates.push({
          updateOne: {
            filter: { _id: task.contract },
            update: { status: "completed" },
          },
        });

        estateBulkUpdates.push({
          updateOne: {
            filter: { _id: task.estate },
            update: { status: "available" },
          },
        });

        promises.push(
          Contract.findById(task.contract)
            .select("tenant estate")
            .populate("tenant", "name phone")
            .populate("estate", "name")
            .lean()
            .then((contract) => {
              sendWAText(
                formatSaudiNumber(contract.tenant.phone),
                `Hello ${contract.tenant.name}, your contract for "${contract.estate.name}" has finished.
                \n\n
                مرحبًا ${contract.tenant.name}، انتهى عقدك لـ "${contract.estate.name}".
                `
              );
            })
        );
      } else if (task.type === "CONTRACT_ACTIVATION") {
        contractBulkUpdates.push({
          updateOne: {
            filter: { _id: task.contract },
            update: { status: "active" },
          },
        });

        estateBulkUpdates.push({
          updateOne: {
            filter: { _id: task.estate },
            update: { status: "rented" },
          },
        });

        promises.push(
          ScheduledMission.create({
            type: "CONTRACT_EXPIRATION",
            scheduledAt: task.contractEndDate,
            contract: task.contract,
            estate: task.estate,
          })
        );
      } else if (task.type === "REVENUE_REMINDER") {
        const revenuePopOptions = [
          {
            path: "tenant",
            select: "name phone",
          },
          {
            path: "landlord",
            select: "name phone",
          },
          {
            path: "estate",
            select: "name",
          },
          {
            path: "compound",
            select: "name",
          },
        ];

        promises.push(
          Revenue.findById(task.revenue)
            .select("tenant landlord amount estate compound status dueDate")
            .populate(revenuePopOptions)
            .lean()
            .then(async (revenue) => {
              if (revenue && revenue.status === "pending") {
                const tenantPhone = revenue.tenant?.phone;
                const landlordPhone = revenue.landlord?.phone;
                const estateName = revenue.estate?.name;
                const compoundName = revenue.compound?.name;

                if (tenantPhone) {
                  await sendWAText(
                    formatSaudiNumber(tenantPhone),
                    `Hello ${
                      revenue.tenant.name
                    }, diwan reminder for payment of ${
                      revenue.amount
                    } for the estate "${
                      estateName || compoundName || "Diwan property"
                    }".

                    \n\n
                    مرحبًا ${revenue.tenant.name}، تذكير ديوان بدفع ${
                      revenue.amount
                    } للعقار "${
                      estateName || compoundName || "Diwan property"
                    }".
                    `
                  );
                }

                if (landlordPhone) {
                  await sendWAText(
                    formatSaudiNumber(landlordPhone),
                    `Diwan Reminder: ${revenue.tenant.name} payment of ${
                      revenue.amount
                    } is due on ${revenue.dueDate.toDateString()} for the estate "${
                      estateName || compoundName || "Diwan property"
                    }".

                    \n\n
                    تذكير ديوان: دفع ${revenue.tenant.name} بقيمة ${
                      revenue.amount
                    } مستحق في ${revenue.dueDate.toDateString()} للعقار "${
                      estateName || compoundName || "Diwan property"
                    }".
                    `
                  );
                }
              }
            })
            .catch((err) =>
              console.error(`Error fetching revenue for reminder: ${err}`)
            )
        );
      } else if (task.type === "EXPENSE_REMINDER") {
        const expensePopOptions = [
          {
            path: "contact",
            select: "name phone",
          },
          {
            path: "landlord",
            select: "name phone",
          },
          {
            path: "estate",
            select: "name",
          },
          {
            path: "compound",
            select: "name",
          },
        ];

        promises.push(
          Expense.findById(task.expense)
            .select("contact landlord amount estate compound status dueDate")
            .populate(expensePopOptions)
            .lean()
            .then(async (expense) => {
              if (expense && expense.status === "pending") {
                const contactName = expense.contact?.name;
                const landlordPhone = expense.landlord?.phone;
                const estateName = expense.estate?.name;
                const compoundName = expense.compound?.name;

                if (landlordPhone) {
                  await sendWAText(
                    formatSaudiNumber(landlordPhone),
                    `Diwan Reminder: ${
                      contactName || "contact"
                    } should receive payment of ${
                      expense.amount
                    } for the estate "${
                      estateName || compoundName || "Diwan property"
                    }" by ${expense.dueDate.toDateString()}.

                    \n\n
                    تذكير ديوان: يجب على ${
                      contactName || "الخدمة"
                    } استلام مبلغ ${expense.amount} للعقار "${
                      estateName || compoundName || "Diwan property"
                    }" بحلول ${expense.dueDate.toDateString()}.
                    `
                  );
                }
              }
            })
            .catch((err) =>
              console.error(`Error fetching expense for reminder: ${err}`)
            )
        );
      }
    });

    if (contractBulkUpdates.length > 0) {
      promises.push(Contract.bulkWrite(contractBulkUpdates));
    }

    if (estateBulkUpdates.length > 0) {
      promises.push(Estate.bulkWrite(estateBulkUpdates));
    }

    if (missionsIds.length > 0) {
      promises.push(
        ScheduledMission.bulkWrite(
          missionsIds.map((id) => ({
            updateOne: {
              filter: { _id: id },
              update: { isDone: true },
            },
          }))
        )
      );
    }

    await Promise.all(promises);

    console.log(
      `Processed ${missions.length} scheduled missions successfully.`
    );
  } catch (error) {
    console.error("Error processing scheduled missions:", error);
  } finally {
    isTaskRunning = false;
    console.timeEnd("checkScheduledMissions");
  }
};

let isSubscriptionTaskRunning = false;

const checkSubscriptions = async () => {
  console.time("checkSubscriptionMissions");

  if (isSubscriptionTaskRunning) {
    console.timeEnd("checkSubscriptionMissions");
    return;
  }

  isSubscriptionTaskRunning = true;

  try {
    const missions = await ScheduledMission.find({
      type: "SUBSCRIPTION_EXPIRATION",
      isDone: false,
      scheduledAt: { $lte: new Date() },
    })
      .select("_id account accountOwner")
      .lean();

    if (missions.length === 0) {
      console.log("No subscription missions to process.");
      return;
    }

    const promises = [];
    const missionsIds = [];
    const accountBulkUpdates = [];

    missions.forEach((task) => {
      missionsIds.push(task._id);

      const accountUpdatedData = {
        allowedUsers: 0,
        allowedCompounds: 0,
        allowedEstates: 0,
        maxEstatesInCompound: 0,
        isVIP: false,
        isFavoriteAllowed: false,
        isRemindersAllowed: false,
        isAnalysisAllowed: false,
        isFinancialReportsAllowed: false,
        isOperationalReportsAllowed: false,
        isCompoundsReportsAllowed: false,
        isTasksAllowed: false,
        isFilesExtractAllowed: false,
        isServiceContactsAllowed: false,
        isUserPermissionsAllowed: false,
      };

      accountBulkUpdates.push({
        updateOne: {
          filter: { _id: task.account },
          update: accountUpdatedData,
        },
      });

      sendWAText(
        formatSaudiNumber(task.accountOwner.phone),
        `Hello ${task.accountOwner.name}, your subscription has expired.\nPlease renew your subscription to continue using Diiwan.com .
        
        \n\n
        عزيزي ${task.accountOwner.name}، انتهى اشتراكك. \nيرجى تجديد اشتراكك للمتابعة في استخدام Diiwan.com.
        `
      );

      const html = subscriptionExpirationHtml(task.accountOwner.name);

      sendEmail(
        task.accountOwner.email,
        "Your Subscription Has Ended",
        `Dear ${task.accountOwner.name},\nWe wanted to let you know that your subscription to Diiwan.com has ended.
        
        \n\n
        عزيزي ${task.accountOwner.name}،\nنود أن نعلمك أن اشتراكك في Diiwan.com قد انتهى.
        `,
        html
      );

      promises.push(
        Account.updateOne({ _id: task.account }, accountUpdatedData)
      );
    });

    if (missionsIds.length > 0) {
      promises.push(
        ScheduledMission.bulkWrite(
          missionsIds.map((id) => ({
            updateOne: {
              filter: { _id: id },
              update: { isDone: true },
            },
          }))
        )
      );
    }

    Promise.all(promises).then(() => {
      console.log(
        `Processed ${missions.length} subscription missions successfully.`
      );
    });
  } catch (error) {
    console.error("Error processing subscription missions:", error);
  } finally {
    isSubscriptionTaskRunning = false;
    console.timeEnd("checkSubscriptionMissions");
  }
};

const clearFinishedMissions = async () => {
  await ScheduledMission.deleteMany({ isDone: true });

  console.log("Old scheduled missions deleted");
};

const startCronJobs = () => {
  cron.schedule("*/3 * * * *", checkScheduledMissions); // every 3 minutes
  cron.schedule("0 17 * * 0", clearFinishedMissions); // every Sunday at 5 PM
  cron.schedule("0 */6 * * *", checkSubscriptions); // every 6 hours
};

module.exports = startCronJobs;
