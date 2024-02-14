import {
  createQuestionCondition,
  andCondition,
  orCondition,
  evaluateCondition,
} from '../src/app/questionnaire/_utils/conditions'; // Update the import path to point to your new conditions.ts

describe('Form Conditions Evaluation Tests', () => {
  // Test for createQuestionCondition
  describe('createQuestionCondition', () => {
    it('creates a basic question condition', () => {
      const condition = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [true],
      };
      expect(createQuestionCondition(condition)).toEqual(condition);
    });
  });

  // Test for andCondition
  describe('andCondition', () => {
    it('creates an AND condition', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [true],
      };
      const condition2 = {
        questionID: 'stringArray',
        operator: 'NOT_EQUALS',
        value: ["option1"],
      };
      const andCond = {
        type: 'AND',
        conditions: [condition1, condition2],
      };
      expect(andCondition(condition1, condition2)).toEqual(andCond);
    });
  });

  // Test for orCondition
  describe('orCondition', () => {
    it('creates an OR condition', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [true],
      };
      const condition2 = {
        questionID: 'stringArray',
        operator: 'NOT_EQUALS',
        value: ["option1"],
      };
      const orCond = {
        type: 'OR',
        conditions: [condition1, condition2],
      };
      expect(orCondition(condition1, condition2)).toEqual(orCond);
    });
  });

  // Tests for evaluateCondition EQUALS
  describe('evaluateCondition Tests EQUALS', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': ''
    };

    // Boolean
    it('evaluates EQUALS condition correctly be true for boolean', () => {
      const condition = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [true],
      };
      expect(evaluateCondition(condition, mockAnswers)).toBe(true);
    });
    it('evaluates EQUALS condition correctly be false for boolean', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [false],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [false, true],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
    });

    // String[]
    it('evaluates EQUALS condition correctly be true for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'EQUALS',
        value: ['option1', 'option2'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'stringArrayEmpty',
        operator: 'EQUALS',
        value: [],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringArrayEmpty',
        operator: 'EQUALS',
        value: [''],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
    });
    it('evaluates EQUALS condition correctly be false for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'EQUALS',
        value: ['option1', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'EQUALS',
        value: ['option1', 'option2', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'stringArray',
        operator: 'EQUALS',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
      const condition4 = {
        questionID: 'stringArrayEmpty',
        operator: 'EQUALS',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(false);
    });

    // String
    it('evaluates EQUALS condition correctly be true for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'EQUALS',
        value: ['singleOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'stringEmpty',
        operator: 'EQUALS',
        value: [],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringEmpty',
        operator: 'EQUALS',
        value: [''],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
    });
    it('evaluates EQUALS condition correctly be false for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'EQUALS',
        value: ['singleOption', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'string',
        operator: 'EQUALS',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'string',
        operator: 'EQUALS',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
      const condition4 = {
        questionID: 'stringEmpty',
        operator: 'EQUALS',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(false);
    });
  });

  // Tests for evaluateCondition IS_ALL_IN
  describe('evaluateCondition Tests IS_ALL_IN', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': '',
    };

    // Boolean
    it('evaluates IS_ALL_IN condition correctly be true for boolean', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ALL_IN',
        value: [true],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ALL_IN',
        value: [true, false],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
    });
    it('evaluates IS_ALL_IN condition correctly be false for boolean', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ALL_IN',
        value: [false],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ALL_IN',
        value: [false, false],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ALL_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
    });

    // String[]
    it('evaluates IS_ALL_IN condition correctly be true for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'IS_ALL_IN',
        value: ['option1', 'option2'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'IS_ALL_IN',
        value: ['option1', 'option2', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ALL_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
      const condition4 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ALL_IN',
        value: [''],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(true);
      const condition5 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ALL_IN',
        value: ['', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition5, mockAnswers)).toBe(true);
    });
    it('evaluates IS_ALL_IN condition correctly be false for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'IS_ALL_IN',
        value: ['option1', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'IS_ALL_IN',
        value: [],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ALL_IN',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
    });

    // String
    it('evaluates IS_ALL_IN condition correctly be true for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'IS_ALL_IN',
        value: ['singleOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'string',
        operator: 'IS_ALL_IN',
        value: ['singleOption', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringEmpty',
        operator: 'IS_ALL_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
      const condition4 = {
        questionID: 'stringEmpty',
        operator: 'IS_ALL_IN',
        value: [''],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(true);
      const condition5 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ALL_IN',
        value: ['', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition5, mockAnswers)).toBe(true);
    });
    it('evaluates IS_ALL_IN condition correctly be false for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'IS_ALL_IN',
        value: ['notAnOption', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'string',
        operator: 'IS_ALL_IN',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'string',
        operator: 'IS_ALL_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
      const condition4 = {
        questionID: 'stringEmpty',
        operator: 'IS_ALL_IN',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(false);
    });
  });

  // Tests for evaluateCondition IS_ANY_IN
  describe('evaluateCondition Tests IS_ANY_IN', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': '',
    };

    // Boolean
    it('evaluates IS_ANY_IN condition correctly be true for boolean', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ANY_IN',
        value: [true],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ANY_IN',
        value: [true, false],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
    });
    it('evaluates IS_ANY_IN condition correctly be false for boolean', () => {
      const condition1 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ANY_IN',
        value: [false],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ANY_IN',
        value: [false, false],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'booleanAnswer',
        operator: 'IS_ANY_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
    });

    // String[]
    it('evaluates IS_ANY_IN condition correctly be true for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: ['option1', 'option2'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: ['option1', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ANY_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
      const condition4 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ANY_IN',
        value: [''],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(true);
      const condition5 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ANY_IN',
        value: ['', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition5, mockAnswers)).toBe(true);
    });
    it('evaluates IS_ANY_IN condition correctly be false for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: ['notAnOption', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: [],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ANY_IN',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
    });

    // String
    it('evaluates IS_ANY_IN condition correctly be true for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'IS_ANY_IN',
        value: ['singleOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'string',
        operator: 'IS_ANY_IN',
        value: ['singleOption', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringEmpty',
        operator: 'IS_ANY_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
      const condition4 = {
        questionID: 'stringEmpty',
        operator: 'IS_ANY_IN',
        value: [''],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(true);
      const condition5 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_ANY_IN',
        value: ['', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition5, mockAnswers)).toBe(true);
    });
    it('evaluates IS_ANY_IN condition correctly be false for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'IS_ANY_IN',
        value: ['notAnOption', 'nonExistingOption'],
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'string',
        operator: 'IS_ANY_IN',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'string',
        operator: 'IS_ANY_IN',
        value: [],
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
      const condition4 = {
        questionID: 'stringEmpty',
        operator: 'IS_ANY_IN',
        value: ['nonExistingOption'],
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(false);
    });
  });

  // Tests for evaluateCondition IS_EMPTY
  describe('evaluateCondition Tests IS_EMPTY', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': '',
    };

    // Boolean not applicable

    // String[]
    it('evaluates IS_EMPTY condition correctly be true for string[]', () => {
      const condition1 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
    });
    it('evaluates IS_EMPTY condition correctly be false for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
    });

    // String
    it('evaluates IS_EMPTY condition correctly be true for string', () => {
      const condition1 = {
        questionID: 'stringEmpty',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
    });

    it('evaluates IS_EMPTY condition correctly be false for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
    });
  });

  // Tests for evaluateCondition IS_EMPTY
  describe('evaluateCondition Tests IS_EMPTY', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': '',
    };

    // Boolean not applicable

    // String[]
    it('evaluates IS_EMPTY condition correctly be true for string[]', () => {
      const condition1 = {
        questionID: 'stringArrayEmpty',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
    });
    it('evaluates IS_EMPTY condition correctly be false for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
    });

    // String
    it('evaluates IS_EMPTY condition correctly be true for string', () => {
      const condition1 = {
        questionID: 'stringEmpty',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
    });

    it('evaluates IS_EMPTY condition correctly be false for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'IS_EMPTY',
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
    });
  });

  // Tests for evaluateCondition SELECTED_*
  describe('evaluateCondition Tests SELECTED_*', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': '',
    };

    // Boolean not applicable

    // String[]
    it('evaluates SELECTED_* condition correctly be true for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'SELECTED_EQUALS',
        value: 2
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(true);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'SELECTED_NOT_EQUALS',
        value: 3
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(true);
      const condition3 = {
        questionID: 'stringArray',
        operator: 'SELECTED_LESS_THAN',
        value: 3
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(true);
      const condition4_1 = {
        questionID: 'stringArray',
        operator: 'SELECTED_LESS_THAN_OR_EQUALS',
        value: 3
      };
      expect(evaluateCondition(condition4_1, mockAnswers)).toBe(true);
      const condition4_2 = {
        questionID: 'stringArray',
        operator: 'SELECTED_LESS_THAN_OR_EQUALS',
        value: 2
      };
      expect(evaluateCondition(condition4_2, mockAnswers)).toBe(true);
      const condition5 = {
        questionID: 'stringArray',
        operator: 'SELECTED_GREATER_THAN',
        value: 1
      };
      expect(evaluateCondition(condition5, mockAnswers)).toBe(true);
      const condition6_1 = {
        questionID: 'stringArray',
        operator: 'SELECTED_GREATER_THAN_OR_EQUALS',
        value: 1
      };
      expect(evaluateCondition(condition6_1, mockAnswers)).toBe(true);
      const condition6_2 = {
        questionID: 'stringArray',
        operator: 'SELECTED_GREATER_THAN_OR_EQUALS',
        value: 2
      };
      expect(evaluateCondition(condition6_2, mockAnswers)).toBe(true);
    });
    it('evaluates SELECTED_* condition correctly be false for string[]', () => {
      const condition1 = {
        questionID: 'stringArray',
        operator: 'SELECTED_EQUALS',
        value: 3
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
      const condition2 = {
        questionID: 'stringArray',
        operator: 'SELECTED_NOT_EQUALS',
        value: 2
      };
      expect(evaluateCondition(condition2, mockAnswers)).toBe(false);
      const condition3 = {
        questionID: 'stringArray',
        operator: 'SELECTED_LESS_THAN',
        value: 2
      };
      expect(evaluateCondition(condition3, mockAnswers)).toBe(false);
      const condition4 = {
        questionID: 'stringArray',
        operator: 'SELECTED_LESS_THAN_OR_EQUALS',
        value: 1
      };
      expect(evaluateCondition(condition4, mockAnswers)).toBe(false);
      const condition5 = {
        questionID: 'stringArray',
        operator: 'SELECTED_GREATER_THAN',
        value: 2
      };
      expect(evaluateCondition(condition5, mockAnswers)).toBe(false);
      const condition6 = {
        questionID: 'stringArray',
        operator: 'SELECTED_GREATER_THAN_OR_EQUALS',
        value: 3
      };
      expect(evaluateCondition(condition6, mockAnswers)).toBe(false);
    });

    // String
    it('evaluates SELECTED_* condition correctly be false for string', () => {
      const condition1 = {
        questionID: 'string',
        operator: 'SELECTED_EQUALS',
        value: 1,
      };
      expect(evaluateCondition(condition1, mockAnswers)).toBe(false);
    });
  });



  // Tests for Composite AND
  describe('evaluateCondition Composite AND', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': ''
    };

    it('evaluates composite AND condition correctly be true', () => {
      const condition1 = { // true
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [true],
      };
      const condition2 = { // true
        questionID: 'stringArray',
        operator: 'IS_ALL_IN',
        value: ['option1', 'option2'],
      };
      const andConditionComposite = {
        type: 'AND',
        conditions: [condition1, condition2],
      };
      expect(evaluateCondition(andConditionComposite, mockAnswers)).toBe(true);
    });

    it('evaluates composite AND condition correctly be false', () => {
      const condition1 = { // false
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [false],
      };
      const condition2 = { // true
        questionID: 'stringArray',
        operator: 'IS_ALL_IN',
        value: ['option1', 'option2'],
      };
      const andConditionComposite = {
        type: 'AND',
        conditions: [condition1, condition2],
      };
      expect(evaluateCondition(andConditionComposite, mockAnswers)).toBe(false);
    });
  });

  // Tests for Composite OR
  describe('evaluateCondition Composite OR', () => {
    const mockAnswers = {
      'booleanAnswer': true,
      'stringArray': ['option1', 'option2'],
      'stringArrayEmpty': [''],
      'string': 'singleOption',
      'stringEmpty': ''
    };

    it('evaluates composite OR condition correctly be true', () => {
      const condition1 = { // false
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [false],
      };
      const condition2 = { // true
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: ['option1'],
      };
      const orConditionComposite1 = {
        type: 'OR',
        conditions: [condition1, condition2],
      };
      expect(evaluateCondition(orConditionComposite1, mockAnswers)).toBe(true);

      const condition3 = { // true
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [true],
      };
      const condition4 = { // true
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: ['option1'],
      };
      const orConditionComposite2 = {
        type: 'OR',
        conditions: [condition3, condition4],
      };
      expect(evaluateCondition(orConditionComposite2, mockAnswers)).toBe(true);
    });

    it('evaluates composite OR condition correctly be false', () => {
      const condition1 = { // false
        questionID: 'booleanAnswer',
        operator: 'EQUALS',
        value: [false],
      };
      const condition2 = { // false
        questionID: 'stringArray',
        operator: 'IS_ANY_IN',
        value: ['nonExistingOption'],
      };
      const orConditionComposite = {
        type: 'OR',
        conditions: [condition1, condition2],
      };
      expect(evaluateCondition(orConditionComposite, mockAnswers)).toBe(false);
    });
  });
});

