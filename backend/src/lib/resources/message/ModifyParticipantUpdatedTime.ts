import { Construct, Duration } from "@aws-cdk/core";
import { ITable } from "@aws-cdk/aws-dynamodb";
import { DynamoEventSource, SqsDlq } from "@aws-cdk/aws-lambda-event-sources";

import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime, StartingPosition } from "@aws-cdk/aws-lambda";
import { Queue } from "@aws-cdk/aws-sqs";
import { join } from "path";

export default class ModifyParticipantUpdatedTime {
  constructor(
    scope: Construct,
    {
      messageTable,
      participantTable,
    }: { messageTable: ITable; participantTable: ITable }
  ) {
    // Lambda to handle streaming the event
    const lambda = new NodejsFunction(scope, "modifyParticipantUpdatedTime", {
      entry: join(
        __dirname,
        "../../../lambdas/modifyParticipantUpdatedTime.ts"
      ),
      runtime: Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: Duration.seconds(15), // Can process a lot of items
      description: `Updates the "UPDATED" time for participants, when a new message is added to a conversation.`,
      environment: {
        PARTICIPANT_TABLE_NAME: participantTable.tableName,
      },
    });

    // Table stream permissions
    messageTable.grantStreamRead(lambda);
    participantTable.grantReadWriteData(lambda);

    // DLQ
    const deadLetterQueue = new Queue(
      scope,
      "modifyParticipantUpdatedTimeDLQ",
      { retentionPeriod: Duration.days(14) }
    );

    // Event mapping
    lambda.addEventSource(
      new DynamoEventSource(messageTable, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 10,
        bisectBatchOnError: true,
        onFailure: new SqsDlq(deadLetterQueue),
        retryAttempts: 10,
      })
    );

    // Alarm for errors
    const metric = deadLetterQueue.metricNumberOfMessagesSent({
      period: Duration.minutes(60),
    });
    metric.createAlarm(scope, "modifyParticipantAlarm", {
      alarmDescription: "A participant updated time could not be modified.",
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
    });

    // Event source mapping, to allow re-processing of the items in the DLQ by simply enabling this.
    // lambda.addEventSourceMapping("modifyParticipantDLQMapping", {
    //   eventSourceArn: deadLetterQueue.queueArn,
    //   enabled: true,
    //   batchSize: 10,
    // });
    // deadLetterQueue.grantConsumeMessages(lambda);
  }
}
