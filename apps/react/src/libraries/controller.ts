import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Minimal Controller for managing component state and lifecycle.
 */
export class Controller<TState extends Record<string, unknown> = {}, TProps extends Record<string, unknown> = {}> {
  state: TState = {} as TState;
  props: TProps = {} as TProps;

  #resolved = false;
  #destroyed = false;

  #setState: (state: Partial<TState>) => void;
  #setLoading: (state: boolean) => void;

  constructor(setState: (state: Partial<TState>) => void, setLoading: (state: boolean) => void) {
    this.#setState = setState;
    this.#setLoading = setLoading;
  }

  /**
   * Factory method to create a new controller instance.
   */
  static make<TController extends typeof Controller>(
    this: TController,
    setState: any,
    setLoading: any,
  ): InstanceType<TController> {
    return new this(setState, setLoading) as InstanceType<TController>;
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle
   |--------------------------------------------------------------------------------
   */

  /**
   * Resolves the controller with given props.
   * - First time: Runs onInit() then onResolve()
   * - Subsequent times: Runs only onResolve()
   */
  async $resolve(props: TProps): Promise<void> {
    if (this.#destroyed === true) {
      return;
    }

    this.props = props;
    let state: Partial<TState> = {};

    try {
      if (this.#resolved === false) {
        const initState = await this.onInit();
        if (initState) {
          state = { ...state, ...initState };
        }
      }
      const resolveState = await this.onResolve();
      if (resolveState) {
        state = { ...state, ...resolveState };
      }
    } catch (error) {
      console.error("Controller resolve error:", error);
      throw error;
    }

    this.#resolved = true;

    if (this.#destroyed === false) {
      this.setState(state);
    }
  }

  /**
   * Destroys the controller and cleans up resources.
   */
  async $destroy(): Promise<void> {
    this.#destroyed = true;
    await this.onDestroy();
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle Hooks
   |--------------------------------------------------------------------------------
   */

  /**
   * Called once when the controller is first initialized.
   */
  async onInit(): Promise<Partial<TState> | void> {
    return {};
  }

  /**
   * Called every time props change (including first mount).
   */
  async onResolve(): Promise<Partial<TState> | void> {
    return {};
  }

  /**
   * Called when the controller is destroyed.
   */
  async onDestroy(): Promise<void> {}

  /*
   |--------------------------------------------------------------------------------
   | State Management
   |--------------------------------------------------------------------------------
   */

  /**
   * Updates the controller state.
   */
  setState(state: Partial<TState>): void;
  setState<K extends keyof TState>(key: K, value: TState[K]): void;
  setState<K extends keyof TState>(...args: [K | Partial<TState>, TState[K]?]): void {
    if (this.#destroyed) {
      return;
    }

    const [target, value] = args;

    if (typeof target === "string") {
      this.state = { ...this.state, [target]: value };
    } else {
      this.state = { ...this.state, ...(target as Partial<TState>) };
    }

    this.#setState(this.state);
    this.#setLoading(false);
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Returns all public methods as bound actions.
   */
  toActions(): ControllerActions<this> {
    const actions: any = {};
    const prototype = Object.getPrototypeOf(this);

    for (const name of Object.getOwnPropertyNames(prototype)) {
      if (this.#isAction(name)) {
        const method = (this as any)[name];
        if (typeof method === "function") {
          actions[name] = method.bind(this);
        }
      }
    }

    return actions;
  }

  #isAction(name: string): boolean {
    return name !== "constructor" && !name.startsWith("$") && !name.startsWith("_") && !name.startsWith("#");
  }
}

/*
 |--------------------------------------------------------------------------------
 | Hook
 |--------------------------------------------------------------------------------
 */

/**
 * React hook for using a controller.
 *
 * @example
 * ```tsx
 * function LoginView() {
 *   const [state, actions] = useController(LoginController);
 *
 *   return (
 *     <button onClick={actions.login}>
 *       {state.authenticated ? "Logout" : "Login"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useController<TController extends new (...args: any[]) => Controller<any, any>>(
  ControllerClass: TController,
  props?: InstanceType<TController>["props"],
): [InstanceType<TController>["state"], boolean, ControllerActions<InstanceType<TController>>] {
  const [state, setState] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  const controllerRef = useRef<InstanceType<TController> | null>(null);
  const actionsRef = useRef<ControllerActions<InstanceType<TController>> | null>(null);
  const propsRef = useRef(props);

  // Resolve only once after creation
  useMemo(() => {
    const instance = (ControllerClass as any).make(setState, setLoading);
    controllerRef.current = instance;
    actionsRef.current = instance.toActions();

    instance.$resolve(props || {});

    return () => {
      instance.$destroy();
    };
  }, [controllerRef]);

  // Resolve on props change
  useEffect(() => {
    if (propsRef.current !== props) {
      propsRef.current = props;
      controllerRef.current?.$resolve(props || {});
    }
  }, [props]);

  return [state, loading, actionsRef.current!];
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ControllerActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends `$${string}` | `_${string}` | `#${string}` | "constructor"
      ? never
      : T[K]
    : never;
};
