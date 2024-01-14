import { getStepZodSchema } from '../src/app/questionnaire/_utils/utils';

describe('Form Schema Generation Tests', () => {
  // Tests for boolean type
  describe('Boolean Type', () => {
    const stepBoolean = {
      name: 'Boolean Step',
      questions: [
        { type: 'boolean', key: 'q', text: 'Question 1', defaultAnswer: false, isRequired: true }
      ],
    };

    it('validates boolean field correctly', () => {
      const schema = getStepZodSchema(stepBoolean);
      const result = schema.safeParse({ q: true });
      expect(result.success).toBe(true);
    });

    it('treats boolean field as valid even when not provided, due to default value', () => {
      const schema = getStepZodSchema(stepBoolean);
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('allows omission of boolean field when isRequired is false', () => {
      const stepOptionalBoolean = {
        ...stepBoolean,
        questions: [
          { ...stepBoolean.questions[0], isRequired: false }
        ]
      };
      const schema = getStepZodSchema(stepOptionalBoolean);
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  // Tests for multiChoice/multiSelect type
  describe('MultiChoice Type', () => {
    const stepMultiChoice = {
      name: 'MultiChoice/MultiStep Step',
      questions: [
        {
          type: 'multiChoice',
          key: 'q',
          text: 'Question 2',
          defaultAnswer: [],
          isRequired: true,
          options: [{ value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2' }]
        }
      ],
    };

    it('validates multiChoice field correctly', () => {
      const schema = getStepZodSchema(stepMultiChoice);
      const result = schema.safeParse({ q: ['option1'] });
      expect(result.success).toBe(true);
    });

    it('fails multiChoice field for invalid option', () => {
      const schema = getStepZodSchema(stepMultiChoice);
      const result = schema.safeParse({ q: ['invalidOption'] });
      expect(result.success).toBe(false);
    });

    it('requires multiChoice field when isRequired is true', () => {
      const schema = getStepZodSchema(stepMultiChoice);
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('allows omission of multiChoice field when isRequired is false', () => {
      const stepOptionalMultiChoice = {
        ...stepMultiChoice,
        questions: [
          { ...stepMultiChoice.questions[0], isRequired: false }
        ]
      };
      const schema = getStepZodSchema(stepOptionalMultiChoice);
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

  });

  // Tests for select type
  describe('Select Type', () => {
    const stepSelect = {
      name: 'Select Step',
      questions: [
        {
          type: 'select',
          key: 'q',
          text: 'Question 3',
          defaultAnswer: '',
          isRequired: true,
          options: [{ value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2' }],
          placeholder: ''
        }
      ],
    };

    it('validates select field correctly', () => {
      const schema = getStepZodSchema(stepSelect);
      const result = schema.safeParse({ q: 'option1' });
      expect(result.success).toBe(true);
    });

    it('fails select field for invalid option', () => {
      const schema = getStepZodSchema(stepSelect);
      const result = schema.safeParse({ q: 'invalidOption' });
      expect(result.success).toBe(false);
    });

    it('requires select field when isRequired is true', () => {
      const schema = getStepZodSchema(stepSelect);
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('allows omission of select field when isRequired is false', () => {
      const stepOptionalSelect = {
        ...stepSelect,
        questions: [
          { ...stepSelect.questions[0], isRequired: false }
        ]
      };
      const schema = getStepZodSchema(stepOptionalSelect);
      const result = schema.safeParse({ q: '' });
      expect(result.success).toBe(true);
    });
  });
});
