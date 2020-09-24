/**
 * @fileoverview Rule to detect hard coded strings.
 * @author Felipe Bruce
 */
'use strict';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    'detect-hard-code': {

      create(context) {
        /**
         * Aux function to SequenceExpression.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */
        function sequenceExpressionReport(node) {
          node.expressions.forEach(binaryExpression => {
            if(binaryExpression.right.type === 'Literal' || binaryExpression.right.type === 'TemplateLiteral') {
              context.report({
                node,
                loc: binaryExpression.right.loc,
                message: "Hardcoded string detected!"
              });
            }
            if(binaryExpression.left.type === 'Literal' || binaryExpression.left.type === 'TemplateLiteral') {
              context.report({
                node,
                loc: binaryExpression.left.loc,
                message: "Hardcoded string detected!"
              });
            }
          });
        }

        /**
         * Aux function to CallExpression.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */
        function callExpressionArguments(node) {
          node.arguments.forEach(arg => {
            if((arg.type === 'Literal' || arg.type === 'TemplateLiteral' &&  node.callee.property.name !== 'instant') && 
                !hasRegex(arg) && typeof arg.value !== 'number' && 
                typeof arg.value !== 'boolean' && !isNull(arg) && 
                arg.value !== '') {
              context.report({
                node,
                loc: arg.loc,
                message: "Hardcoded string detected!"
              });
            }
          });
        }
        
        /**
         * Checks if a node has regex.
         * @param {ASTNode} node The node to check.
         * @returns {boolean}
         * @private
         */
        function hasRegex(node) {
          if(node.regex){
            return true;
          }
          return false;
        }
      
        /**
         * Checks each right node of ArrowFunctionExpression.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */
        function hasRightLiteral(node) {
          if(node.right) {
            if(node.right.type === 'Literal' || node.right.type === 'TemplateLiteral') {
              context.report({
                node,
                loc: node.right.loc,
                message: "Hardcoded string detected!"
              });
            }
            hasRightLiteral(node.right);
          }
        }

        /**
         * Exclude it and describe as Calee target to trigger the report.
         * @param {ASTNode} node The node to check.
         * @returns {boolean}
         * @private
         */
        function isCalleeTarget(node) {
          const name = node.callee.name;
          if(name === 'it' || name === 'describe'){
            return false;
          }
          return true;
        }

        /**
         * Checks if a node value is a boolean.
         * @param {ASTNode} node The node to check.
         * @returns {boolean}
         * @private
         */
        function isBoolean(node) {
          return (typeof node.value) === 'boolean';
        }

        /**
         * Check if the node value is null.
         * @param {ASTNode} node The node to check.
         * @returns {boolean}
         * @private
         */
        function isNull(node) {
          return typeof node.value === 'object' && node.raw === 'null';
        }

        return {
          MemberExpression: function (node) {
          if (node.property.type === 'Literal' && typeof node.property.value !== 'number') {
            context.report({
              node,
              loc: node.property.loc,
              message: "Hardcoded string detected!"
            });
          }
          },
          SequenceExpression: function (node) {
            sequenceExpressionReport(node);
          },
          Property: function (node) {
            if(node.parent.parent.parent.type !== 'Decorator') {
            if (node.value.type === 'Literal' && !isBoolean(node.value) && typeof node.value.value !== 'number' && node.value.value !== '') {
              context.report({
                node,
                loc: node.value.loc,
                message: "Hardcoded string detected"
              });
            }
          }
          },
          CallExpression: function (node) {
            if(node.parent.type !== 'Decorator' && isCalleeTarget(node)){
            callExpressionArguments(node);
            }
          },
          ArrowFunctionExpression: function(node) {
            if(node.body.type === 'LogicalExpression') {
              hasRightLiteral(node.body)
            }
          }
        };
      },
    },
  },
};
