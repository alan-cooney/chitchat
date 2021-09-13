import { buildSchema } from "graphql";
import { plugin } from "../aws-schema-ast";

test("Runs without errors", () => {
  const schema = buildSchema(`
  type Query {
    hello: String
  }
`);
  const res = plugin(schema);
  expect(res.includes("Query")).toBeTruthy();
});

test("Removes comments", () => {
  const schema = buildSchema(`
      scalar AWSDateTime
      scalar DateTime
      type Query {
        """ Comment """
        hello: String
      }
    `);
  const res = plugin(schema);
  expect(res.includes('"""')).toBeFalsy();
});

test('Removes none "@aws_" directives', () => {
  const schema = buildSchema(`
      scalar AWSDateTime
      directive @directive on OBJECT | FIELD_DEFINITION

      type user @directive {
        name: String
      }

      type roles {
        role: String
      }

      type Query {
        """ Comment """
        hello: String @directive
        role: String
      }
    `);

  const res = plugin(schema).replace(
    "directive @directive on OBJECT | FIELD_DEFINITION",
    ""
  );
  expect(res.includes("@directive")).toBeFalsy();
});

test('Removes "@aws_" directive definitions', () => {
  const schema = buildSchema(`
      scalar AWSDateTime
      directive @directive on OBJECT | FIELD_DEFINITION
      directive @aws_iam on OBJECT | FIELD_DEFINITION

      type user @directive {
        name: String
      }

      type roles {
        role: String
      }

      type Query {
        """ Comment """
        hello: String @directive
        role: String
      }
    `);

  const res = plugin(schema);
  expect(res.includes("@aws_iam")).toBeFalsy();
});

test("Removes AWS Scalars", () => {
  const schema = buildSchema(`
        scalar AWSDateTime
        type Query {
          """ Comment """
          hello: String
        }
      `);
  const res = plugin(schema);
  expect(res.includes('"""')).toBeFalsy();
});
