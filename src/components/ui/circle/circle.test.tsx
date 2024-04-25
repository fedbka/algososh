import { expect, describe, test } from "vitest";
import { Circle } from "./circle";
import { ElementStates } from "../../../types/element-states";

import { render } from "@testing-library/react";

const TEST_DATA = {
  letter: 'CTD',
  index: 1,
  defaultState: ElementStates.Default,
  changingState: ElementStates.Changing,
  modifiedState: ElementStates.Modified,
  reactElement: <Circle letter="'CTD'" isSmall />,
}

describe("Тестирование компонента 'Circle'", () => {

  test("Компонент 'Circle' без буквы формируется без ошибок", () => {
    const { container } = render(<Circle />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с буквой формируется без ошибок", () => {
    const { container } = render(<Circle letter={TEST_DATA.letter} />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с буквой в head формируется без ошибок", () => {
    const { container } = render(<Circle head={TEST_DATA.letter} />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с React-элементом в head формируется без ошибок", () => {
    const { container } = render(<Circle head={TEST_DATA.reactElement} />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с буквой в tail формируется без ошибок", () => {
    const { container } = render(<Circle tail={TEST_DATA.letter} />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с React-элементом в tail формируется без ошибок", () => {
    const { container } = render(<Circle tail={TEST_DATA.reactElement} />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с индексом формируется без ошибок", () => {
    const { container } = render(<Circle index={TEST_DATA.index} />);
    expect(container).toMatchSnapshot();
  });

  test("Компонент 'Circle' с указанным свойством 'isSmall' формируется без ошибок", () => {
    const { container } = render(<Circle isSmall />);
    expect(container).toMatchSnapshot();
  });
  
  test("Компонент 'Circle' с указанным состояние 'ElementStates.Default' формируется без ошибок", () => {
    const { container } = render(<Circle state={TEST_DATA.defaultState} />);
    expect(container).toMatchSnapshot();
  });
  
  test("Компонент 'Circle' с указанным состояние 'ElementStates.Changing' формируется без ошибок", () => {
    const { container } = render(<Circle state={TEST_DATA.changingState} />);
    expect(container).toMatchSnapshot();
  }); 
  
  test("Компонент 'Circle' с указанным состояние 'ElementStates.Modified' формируется без ошибок", () => {
    const { container } = render(<Circle state={TEST_DATA.modifiedState} />);
    expect(container).toMatchSnapshot();
  });  

});