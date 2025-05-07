import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    const { getByTestId } = render(
      <Button title="Test Button" loading={true} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" loading={true} onPress={onPressMock} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
}); 