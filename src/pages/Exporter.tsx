import React, { useState } from "react";

//
import { BabelFileResult, NodePath } from "@babel/core"; // ???!!?
import * as types from "@babel/types";
import ReactJson from "react-json-view";
import {
  ASTtoolsContainer,
  TopBar,
  Spacer,
  ColumnsContainer,
  Column,
} from "./_OLD_AstTools";
//
import { basicCanvas1 } from "../templates/canvas-templates";
import {
  changeAstToCode,
  stringCode_To_Ast,
  renderChildren,
  transformAST,
} from "../functions/ast_functions";

const addImports = (path: NodePath<types.Program>) => {
  path.pushContainer(
    "body",
    types.importDeclaration(
      [
        types.importDefaultSpecifier(types.identifier("React")),
        types.importSpecifier(
          types.identifier("useState"),
          types.identifier("useState")
        ),
      ],
      types.stringLiteral("react")
    )
  );

  path.pushContainer(
    "body",
    types.importDeclaration(
      [
        types.importSpecifier(
          types.identifier("TextInput"),
          types.identifier("TextInput")
        ),
      ],
      types.stringLiteral("ready-fields")
    )
  );
};

const addExport = (path: NodePath<types.Program>) => {
  const commentDebugger = types.debuggerStatement();
  commentDebugger.leadingComments = [
    {
      type: "CommentLine",
      value: "  ",
    } as any,
  ];

  const useStateTypeCallExpression = types.callExpression(
    types.identifier("useState"),
    [types.stringLiteral("")]
  );
  useStateTypeCallExpression.typeParameters =
    types.tsTypeParameterInstantiation([types.tsStringKeyword()]);

  path.pushContainer(
    "body",
    /// START Simple function declaration/body
    [
      types.exportNamedDeclaration(
        types.variableDeclaration("const", [
          types.variableDeclarator(
            // typeAnnotation on identifier -> https://github.com/babel/babel/issues/12895
            Object.assign(types.identifier("FormCreatorInner"), {
              typeAnnotation: types.typeAnnotation(
                types.genericTypeAnnotation(
                  types.qualifiedTypeIdentifier(
                    types.identifier("FC"),
                    types.identifier("React")
                  ),
                  types.typeParameterInstantiation([
                    types.objectTypeAnnotation([]),
                  ])
                )
              ),
            }),
            types.arrowFunctionExpression(
              [
                // types.objectPattern([])
              ],
              // blockStatement body, is just an array of the function statements...
              types.blockStatement([
                types.returnStatement(
                  types.jsxFragment(
                    types.jsxOpeningFragment(),
                    types.jsxClosingFragment(),
                    renderChildren(basicCanvas1)
                  )
                ),
              ])
            )
          ),
        ])
      ),
    ]
    /// END Simple function declaration/body
  );
};

const theString = `
export const FormCreatorInner: React.FC<{}> = () => {

    return (
        <>
          <mesh>
            <boxGeometry args={[5, 5, 5]} />
            <meshBasicMaterial color={"blue"} />
          </mesh>
        </>
    )
}`;
export const Exporter: React.FC<{}> = () => {
  const [babelFileResult, setBabelFileResult] = useState<
    BabelFileResult | undefined
  >();
  const [astResult, setAstResult] = useState<types.File | undefined>();
  const [finalCode, setFinalCode] = useState<string>("");

  return (
    <ASTtoolsContainer>
      <TopBar>
        <button
          onClick={() => {
            stringCode_To_Ast(theString, setBabelFileResult);
          }}
        >
          {`Code To full AST`}
        </button>
        <Spacer />
      </TopBar>

      <TopBar>
        <button
          onClick={() => {
            stringCode_To_Ast("", setBabelFileResult);
          }}
        >
          {`Code To blank AST`}
        </button>
        <Spacer />
        <button
          onClick={() => {
            const ast = transformAST(
              babelFileResult,
              setBabelFileResult,
              addExport
            );
            setAstResult(ast);
          }}
        >
          {`Add Body to AST`}
        </button>
        <Spacer />
        <button
          onClick={() => {
            const finalCode = changeAstToCode(astResult, babelFileResult);
            setFinalCode(finalCode?.code || ""); // dot-code is a string
          }}
        >
          {`AST back to Code`}
        </button>
      </TopBar>
      <ColumnsContainer>
        <Column>
          <div>
            {`--------------------------------------
                      ${theString}`}
          </div>
        </Column>

        <Column>
          {babelFileResult?.ast && (
            <ReactJson
              src={babelFileResult.ast}
              collapsed
              enableClipboard={false}
            />
          )}
        </Column>
        <Column>{finalCode}</Column>
      </ColumnsContainer>
    </ASTtoolsContainer>
  );
};
