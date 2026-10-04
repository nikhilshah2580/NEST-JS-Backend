import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../../users/enums/user-role.enum';

export const ROLES_KEY = 'roles';

// Declares the roles permitted to access a controller or endpoint.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
