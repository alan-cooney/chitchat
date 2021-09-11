import {
  GraphQLSchema,
  parse,
  visit,
  print,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  DirectiveDefinitionNode,
  ScalarTypeDefinitionNode,
} from "graphql";
import { printSchemaWithDirectives } from "@graphql-tools/utils";

// eslint-disable-next-line import/prefer-default-export
export function plugin(schema: GraphQLSchema) {
  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema); // Transforms the string into ASTNode
  const visitor = {
    DirectiveDefinition: (node: DirectiveDefinitionNode) => {
      // Remove AWS Directives
      if (node.name.value.startsWith("aws_")) {
        return null;
      }
      return node;
    },
    ScalarTypeDefinition: (node: ScalarTypeDefinitionNode) => {
      // Remove AWS Scalars
      if (node.name.value.startsWith("AWS")) {
        return null;
      }
      return node;
    },
    FieldDefinition: (node: FieldDefinitionNode) => {
      // remove any directive that doesn't have todo with @aws_
      const filterDirectives = node.directives?.filter((d) =>
        d.name.value.startsWith("aws_")
      );
      return {
        ...node,
        directives: filterDirectives,
      } as FieldDefinitionNode;
    },
    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
      // remove any directive that doesn't have todo with @aws_
      const filterDirectives = node.directives?.filter((d) =>
        d.name.value.startsWith("aws_")
      );
      return {
        ...node,
        directives: filterDirectives,
      } as ObjectTypeDefinitionNode;
    },
  };
  const result = visit(astNode, { leave: visitor });
  const stringResults = print(result);

  const minified = stringResults.replace(/[ ]*"""(.|[\r\n])*?"""\n/g, ""); // Remove comments
  // .replace(/\n\n/g, '\n'); // Remove empty lines
  return minified;
}
