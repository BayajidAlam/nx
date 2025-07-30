import React, { ReactNode } from "react";

interface IIf {
  children?: ReactNode | (() => ReactNode);
  render?: () => ReactNode;
  otherwise?: () => ReactNode;
  condition?: boolean | (() => boolean);
}

const displayName = "If";

const isEmptyChildren = (children: ReactNode) =>
  React.Children.count(children) === 0;

const If = ({
  children,
  condition,
  otherwise = () => undefined,
  render,
}: IIf) => {
  const evaluatedCondition =
    typeof condition === "function" ? condition() : condition;

  if (evaluatedCondition) {
    if (render) {
      return render();
    }

    if (children) {
      if (typeof children === "function") {
        return children();
      }

      return isEmptyChildren(children) ? null : React.Children.only(children);
    }

    return null;
  }

  return otherwise();
};

If.displayName = displayName;

export default If;

/**
 * A conditional wrapper component that renders children or a render function
 * when a given condition is true. If the condition is false, it renders
 * the `otherwise` function if provided.
 *
 * Useful for writing declarative conditionals in JSX, especially to avoid ternaries or inline conditions.
 *
 * @component
 * @example
 * // Using `render` and `otherwise`
 * <If
 *   condition={user.isLoggedIn}
 *   render={() => <Dashboard />}
 *   otherwise={() => <LoginPrompt />}
 * />
 *
 * @example
 * // Using `children` as a function
 * <If condition={true}>
 *   {() => <p>Condition is true</p>}
 * </If>
 *
 * @example
 * // Using `children` directly
 * <If condition={false}>
 *   <p>This will not render</p>
 * </If>
 *
 * @param {object} props
 * @param {boolean | () => boolean} props.condition - The condition to evaluate.
 * @param {ReactNode | () => ReactNode} [props.children] - The children to render when condition is true.
 * @param {() => ReactNode} [props.render] - Alternative to children, used when condition is true.
 * @param {() => ReactNode} [props.otherwise] - What to render if the condition is false.
 *
 * @returns {ReactNode | null} Rendered content based on condition.
 */
