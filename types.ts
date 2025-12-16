export interface RadarData {
  engineering: number;
  delivery: number;
  people: number;
  innovation: number;
}

export type AxisKey = keyof RadarData;

export const LADDERS = {
  engineering: ['Learns', 'Applies', 'Masters', 'Advances', 'Pioneers'], // Top-Left
  delivery: ['Tasks', 'Features', 'Projects', 'Initiatives', 'Strategy'], // Top-Right
  people: ['Absorbs', 'Supports', 'Mentors', 'Guides', 'Elevates'],       // Bottom-Right
  innovation: ['Follows', 'Improves', 'Innovates', 'Architects', 'Envisions'] // Bottom-Left
};
