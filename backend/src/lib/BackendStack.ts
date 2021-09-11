import { Stack, Construct, StackProps } from "@aws-cdk/core";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "@aws-cdk/aws-dynamodb";

export default class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new Table(this, "table", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      sortKey: {
        name: "sk",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });
  }
}
