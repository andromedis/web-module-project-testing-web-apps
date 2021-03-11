import React from 'react';
import {render, screen, wait, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

// Valid constants
const firstName = 'Eddie';
const lastName = 'Burke';
const email = 'eddieburke@gmail.com';
const message = 'Please send me an email.';


test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);

    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText('First Name*');
    userEvent.type(firstNameInput, 'Ed');
    
    await waitFor(() => {
        const errors = screen.queryAllByTestId('error');
        expect(errors.length).toEqual(1);
    })
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    await waitFor(() => {
        const errors = screen.queryAllByTestId('error');
        expect(errors.length).toEqual(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText('First Name*');
    const lastNameInput = screen.getByLabelText('Last Name*');
    const submitButton = screen.getByRole('button');

    userEvent.type(firstNameInput, firstName);
    userEvent.type(lastNameInput, lastName);

    userEvent.click(submitButton);
    
    await waitFor(() => {
        const errors = screen.queryAllByTestId('error');
        expect(errors.length).toEqual(1);
    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText('Email*');
    userEvent.type(emailInput, 'invalid email');

    await waitFor(() => {
        const emailError = screen.queryByText(/email must be a valid email address/);
        expect(emailError).toBeInTheDocument();
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor(() => {
        const lastNameError = screen.queryByText(/lastName is a required field/);
        expect(lastNameError).toBeInTheDocument();
    })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText('First Name*');
    const lastNameInput = screen.getByLabelText('Last Name*');
    const emailInput = screen.getByLabelText('Email*')
    const submitButton = screen.getByRole('button');

    userEvent.type(firstNameInput, firstName);
    userEvent.type(lastNameInput, lastName);
    userEvent.type(emailInput, email);

    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByTestId('firstnameDisplay');
        const lastnameDisplay = screen.queryByTestId('lastnameDisplay');
        const emailDisplay = screen.queryByTestId('emailDisplay');
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();

        expect(messageDisplay).not.toBeInTheDocument();

        expect(firstNameDisplay.textContent).toContain(firstName);
        expect(lastnameDisplay.textContent).toContain(lastName);
        expect(emailDisplay.textContent).toContain(email);

    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    
    const firstNameInput = screen.getByLabelText('First Name*');
    const lastNameInput = screen.getByLabelText('Last Name*');
    const emailInput = screen.getByLabelText('Email*')
    const messageInput = screen.getByLabelText('Message')
    const submitButton = screen.getByRole('button');

    userEvent.type(firstNameInput, firstName);
    userEvent.type(lastNameInput, lastName);
    userEvent.type(emailInput, email);
    userEvent.type(messageInput, message);

    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByTestId('firstnameDisplay');
        const lastnameDisplay = screen.queryByTestId('lastnameDisplay');
        const emailDisplay = screen.queryByTestId('emailDisplay');
        const messageDisplay = screen.queryByTestId('messageDisplay');

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();

        expect(firstNameDisplay.textContent).toContain(firstName);
        expect(lastnameDisplay.textContent).toContain(lastName);
        expect(emailDisplay.textContent).toContain(email);
        expect(messageDisplay.textContent).toContain(message);
    })
});