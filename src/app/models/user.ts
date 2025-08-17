export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;  // Optionnel
  lastName?: string;   // Optionnel
  roles?: string[];    // Optionnel pour la gestion des droits
  createdAt?: string;  // Optionnel - date de création
  updatedAt?: string;  // Optionnel - date de modification
}
