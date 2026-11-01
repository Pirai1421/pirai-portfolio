import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { PERSONAL_INFO, RECOGNITION, EDUCATION, PROJECTS } from '../data/portfolioData';

describe('Portfolio Core Rendering & Interactions', () => {
  it('renders hero section with Pirai Soodan G. headline and intro', () => {
    render(<App />);

    expect(screen.getAllByText(PERSONAL_INFO.name).length).toBeGreaterThan(0);
    expect(screen.getByText(PERSONAL_INFO.headline)).toBeInTheDocument();
    expect(screen.getByText(PERSONAL_INFO.intro)).toBeInTheDocument();
  });

  it('renders verified professional links (LinkedIn, GitHub, Portfolio)', () => {
    render(<App />);

    const linkedInLinks = screen.getAllByRole('link', { name: /LinkedIn/i });
    expect(linkedInLinks.length).toBeGreaterThan(0);
    expect(linkedInLinks[0]).toHaveAttribute('href', PERSONAL_INFO.linkedin);

    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    expect(githubLinks.length).toBeGreaterThan(0);
    expect(githubLinks[0]).toHaveAttribute('href', PERSONAL_INFO.github);
  });

  it('renders education details and CGPA correctly', () => {
    render(<App />);

    expect(screen.getByText(EDUCATION.degree)).toBeInTheDocument();
    expect(screen.getByText(`CGPA: ${EDUCATION.cgpa}`)).toBeInTheDocument();
  });

  it('renders STAR Award Q2 2026 recognition section', () => {
    render(<App />);

    expect(screen.getByText(RECOGNITION.title)).toBeInTheDocument();
    expect(screen.getByText(RECOGNITION.recognition)).toBeInTheDocument();
  });

  it('renders all verified projects and allows opening project deep-dive modal', () => {
    render(<App />);

    PROJECTS.forEach((proj) => {
      expect(screen.getByText(proj.title)).toBeInTheDocument();
    });

    // Click first project deep-dive button
    const deepDiveButtons = screen.getAllByText('Explore Technical Deep-Dive');
    expect(deepDiveButtons.length).toBe(PROJECTS.length);

    fireEvent.click(deepDiveButtons[0]);

    // Check modal opened with problem statement
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Problem Statement')).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByLabelText('Close project details');
    fireEvent.click(closeBtn);
  });

  it('opens and closes resume modal', () => {
    render(<App />);

    const resumeBtn = screen.getByRole('button', { name: /Download Resume/i });
    fireEvent.click(resumeBtn);

    expect(screen.getByText(/Professional Resume/i)).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close Resume Viewer');
    fireEvent.click(closeBtn);
  });
});
