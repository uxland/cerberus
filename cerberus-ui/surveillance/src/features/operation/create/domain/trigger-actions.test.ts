import { describe, it, expect } from 'vitest';
import { appendAction, findTrigger, removeAction } from './trigger-actions';
import { OperationQuestion } from './model';
import { ValueEqualsSpec } from './action-specs';

describe('trigger-actions', () => {
  describe('appendAction', () => {
    it('should add a new action at the root level when path is empty', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [{ description: 'HJello', alternatives: undefined }]
          }
        ]
      };

      // Act
      const result = appendAction(question, '1', []);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions).toHaveLength(2);
      expect(trigger?.actions?.[0].description).toBe('HJello');
      expect(trigger?.actions?.[1].description).toBe('');
    });

    it('should add a new action as an alternative when path has one element', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [{ description: 'HJello', alternatives: undefined }]
          }
        ]
      };

      // Act
      const result = appendAction(question, '1', [0]);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions).toHaveLength(1);
      expect(trigger?.actions?.[0].description).toBe('HJello');
      expect(trigger?.actions?.[0].alternatives).toHaveLength(1);
      expect(trigger?.actions?.[0].alternatives?.[0].description).toBe('');
    });

    it('should add a new action at a deeper nesting level when path has multiple elements', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [
              { 
                description: 'HJello', 
                alternatives: [
                  { description: 'Alternative 1', alternatives: undefined }
                ] 
              }
            ]
          }
        ]
      };

      // Act
      const result = appendAction(question, '1', [0, 0]);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions?.[0].alternatives?.[0].alternatives).toHaveLength(1);
      expect(trigger?.actions?.[0].alternatives?.[0].alternatives?.[0].description).toBe('');
    });

    it('should return the original question when trigger is not found', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [{ description: 'HJello', alternatives: undefined }]
          }
        ]
      };

      // Act
      const result = appendAction(question, 'non-existent', []);

      // Assert
      expect(result).toBe(question);
    });


    it('should work with an array of strings with index numbers', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [
              { 
                description: 'HJello', 
                alternatives: [
                  { description: 'Alternative 1', alternatives: undefined }
                ] 
              }
            ]
          }
        ]
      };

      // Act
      const result = appendAction(question, '1', ['0', '0']);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions?.[0].alternatives?.[0].alternatives).toHaveLength(1);
      expect(trigger?.actions?.[0].alternatives?.[0].alternatives?.[0].description).toBe('');
    });
  });
  describe('removeAction', () => {
    it('should remove an action at the root level', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [
              { description: 'Action 1', alternatives: undefined },
              { description: 'Action 2', alternatives: undefined }
            ]
          }
        ]
      };

      // Act
      const result = removeAction(question, '1', [1]);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions).toHaveLength(1);
      expect(trigger?.actions?.[0].description).toBe('Action 1');
    });

    it('should remove an action at a deeper nesting level', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [
              { 
                description: 'Action 1', 
                alternatives: [
                  { description: 'Alternative 1', alternatives: undefined },
                  { description: 'Alternative 2', alternatives: undefined }
                ] 
              }
            ]
          }
        ]
      };

      // Act
      const result = removeAction(question, '1', [0, 1]);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions?.[0].alternatives).toHaveLength(1);
      expect(trigger?.actions?.[0].alternatives?.[0].description).toBe('Alternative 1');
    });

    it('should return the original question when trigger is not found', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [{ description: 'Action 1', alternatives: undefined }]
          }
        ]
      };

      // Act
      const result = removeAction(question, 'non-existent', [0]);

      // Assert
      expect(result).toBe(question);
    });

    it('should return the original question when path is empty', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [{ description: 'Action 1', alternatives: undefined }]
          }
        ]
      };

      // Act
      const result = removeAction(question, '1', []);

      // Assert
      expect(result).toBe(question);
    });

    it('should work with an array of strings with index numbers', () => {
      // Arrange
      const question: OperationQuestion = {
        __type: 'Options',
        id: 'q1',
        text: 'Test Question',
        isMandatory: true,
        triggers: [
          {
            id: '1',
            condition: new ValueEqualsSpec('1'),
            actions: [
              { 
                description: 'Action 1', 
                alternatives: [
                  { description: 'Alternative 1', alternatives: undefined },
                  { description: 'Alternative 2', alternatives: undefined }
                ] 
              }
            ]
          }
        ]
      };

      // Act
      const result = removeAction(question, '1', ['0', '1']);

      // Assert
      const trigger = findTrigger(result, '1');
      expect(trigger).toBeDefined();
      expect(trigger?.actions?.[0].alternatives).toHaveLength(1);
      expect(trigger?.actions?.[0].alternatives?.[0].description).toBe('Alternative 1');
    });
  });
});
