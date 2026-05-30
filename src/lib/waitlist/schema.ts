import { z } from "zod"
import {
  FAILURE_MODE_OPTIONS,
  ROLE_OPTIONS,
  TEAM_TYPE_OPTIONS,
} from "./options"

const roleValues = ROLE_OPTIONS.map((option) => option.value)
const teamTypeValues = TEAM_TYPE_OPTIONS.map((option) => option.value)
const failureModeValues = FAILURE_MODE_OPTIONS.map((option) => option.value)
const defaultRole = ROLE_OPTIONS[0].value
const defaultTeamType = TEAM_TYPE_OPTIONS[0].value
const defaultFailureMode = FAILURE_MODE_OPTIONS[0].value

const inOptions = (value: string, options: readonly string[]) => options.includes(value)

export const waitlistFormSchema = z.object({
  biggestFailureMode: z
    .string()
    .default(defaultFailureMode)
    .refine((value) => inOptions(value, failureModeValues), "Choose the failure mode you want fixed first."),
  email: z.string().trim().email("Enter a valid email."),
  referredByCode: z.string().trim().optional(),
  role: z
    .string()
    .default(defaultRole)
    .refine((value) => inOptions(value, roleValues), "Choose the role that matches you."),
  teamType: z
    .string()
    .default(defaultTeamType)
    .refine((value) => inOptions(value, teamTypeValues), "Choose the team type that fits your setup."),
})

export type WaitlistFormInput = z.output<typeof waitlistFormSchema>
