import type { ModelResult } from '@zenstackhq/runtime';
import type { UserCreateArgs } from './zenstack/input';
import type { User } from './zenstack/models';
import { SchemaType } from './zenstack/schema';

// `User` type includes all scalar fields (including computed ones)
const user: User = { id: 1, email: 'u1@test.com', postCount: 10 };

// you can use types from the `input` module to type query arguments
const userCreate: UserCreateArgs = { data: { email: 'u1@test.com' } };

// the `ModelResult` type can be used to infer model's type given field selection
// and relation inclusion
// { id: number, email: string; postCount: number; posts: Post[] }
type UserWithPosts = ModelResult<SchemaType, 'User', { include: { posts: true } }>;
