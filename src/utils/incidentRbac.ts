/**
 * ITIS Enterprise Role-Based Access Control (RBAC) & Incident Field Sanitization Engine
 * Compliant with ISO 27001, POPIA, SITA Government Standards & Zero Trust Architecture.
 * Ensures ONE Incident Entity powers role-restricted synchronized views.
 */

import { IncidentTicket } from '../types';
import { UserRole } from '../services/authService';

export interface RoleVisibilityMatrixEntry {
  field: string;
  operations: boolean;
  guardian: boolean;
  school: boolean;
  responder: boolean;
  executive: boolean;
}

export const INCIDENT_ROLE_VISIBILITY_MATRIX: RoleVisibilityMatrixEntry[] = [
  { field: 'Incident ID & Metadata', operations: true, guardian: true, school: true, responder: true, executive: true },
  { field: 'Learner Profile & Photo', operations: true, guardian: true, school: true, responder: true, executive: false },
  { field: 'Current Verified Location', operations: true, guardian: true, school: true, responder: true, executive: false },
  { field: 'Device Telemetry (Battery, Signal)', operations: true, guardian: true, school: false, responder: true, executive: false },
  { field: 'GPS Accuracy Meters', operations: true, guardian: false, school: false, responder: true, executive: false },
  { field: 'Live Tactical Map & GIS', operations: true, guardian: false, school: false, responder: true, executive: false },
  { field: 'Simple Guardian Map', operations: false, guardian: true, school: false, responder: false, executive: false },
  { field: 'Medical Warnings & Conditions', operations: true, guardian: true, school: true, responder: true, executive: false },
  { field: 'AI Protocol Recommendations', operations: true, guardian: false, school: false, responder: false, executive: false },
  { field: 'Verification Checklist', operations: true, guardian: false, school: false, responder: false, executive: false },
  { field: 'Dispatch Controls & Unit Selection', operations: true, guardian: false, school: false, responder: false, executive: false },
  { field: 'Responder Live GPS Positions', operations: true, guardian: false, school: false, responder: true, executive: false },
  { field: 'Turn-by-turn Navigation', operations: true, guardian: false, school: false, responder: true, executive: false },
  { field: 'Guardian Contact Buttons', operations: true, guardian: true, school: true, responder: true, executive: false },
  { field: 'School Contact Buttons', operations: true, guardian: true, school: true, responder: true, executive: false },
  { field: 'Guardian Notes Input', operations: true, guardian: true, school: true, responder: true, executive: false },
  { field: 'School Welfare & Lockdown Controls', operations: true, guardian: false, school: true, responder: true, executive: false },
  { field: 'Scene & Resolution Checklist', operations: true, guardian: false, school: false, responder: true, executive: false },
  { field: 'Internal Operator Notes', operations: true, guardian: false, school: false, responder: false, executive: false },
  { field: 'Audit Logs (ISO 27001)', operations: true, guardian: false, school: false, responder: false, executive: false },
  { field: 'Aggregated KPIs & Response Times', operations: true, guardian: false, school: false, responder: false, executive: true },
  { field: 'Commercial Subscription Info', operations: false, guardian: true, school: false, responder: false, executive: true }
];

/**
 * Filter timeline events specifically tailored for each role's view.
 * Prevent exposing tactical/internal logs to guardians or schools.
 */
export function getRoleTailoredTimeline(
  timeline: { time: string; description: string; roleScope?: string }[],
  role: UserRole | 'Responder'
): { time: string; description: string }[] {
  if (!timeline) return [];

  return timeline.filter(item => {
    if (!item.roleScope || item.roleScope === 'all') return true;

    switch (role) {
      case 'Command':
        return true; // Operations sees complete audit
      case 'Parent':
        return item.roleScope === 'guardian' || item.roleScope === 'all';
      case 'School':
        return item.roleScope === 'school' || item.roleScope === 'all';
      case 'Responder':
      case 'Government':
      case 'Technician':
        return item.roleScope === 'responder' || item.roleScope === 'all' || item.roleScope === 'operations';
      case 'Executive':
        return item.roleScope === 'executive' || item.roleScope === 'all';
      default:
        return item.roleScope === 'all';
    }
  });
}

/**
 * Sanitize an IncidentTicket record to ensure field-level security based on RBAC.
 * Returns a role-safe projection of the single incident entity.
 */
export function sanitizeIncidentForRole(incident: IncidentTicket, role: UserRole | 'Responder'): Partial<IncidentTicket> {
  if (!incident) return {};

  const baseProjection: Partial<IncidentTicket> = {
    id: incident.id,
    date: incident.date,
    time: incident.time,
    location: incident.location,
    latitude: incident.latitude,
    longitude: incident.longitude,
    learnerName: incident.learnerName,
    schoolName: incident.schoolName,
    status: incident.status,
    category: incident.category,
    priority: incident.priority || 'High',
    timeline: getRoleTailoredTimeline(incident.timeline || [], role)
  };

  if (role === 'Command' || role === 'Admin') {
    // Operations Command Centre sees complete operational record
    return {
      ...incident,
      timeline: getRoleTailoredTimeline(incident.timeline || [], role)
    };
  }

  if (role === 'Parent') {
    // Guardian View: Strictly reassuring, simple, non-tactical info
    return {
      ...baseProjection,
      guardianName: incident.guardianName,
      latestVerifiedUpdate: incident.latestVerifiedUpdate || 'Command Centre is monitoring device telemetry and location.',
      guardianNotes: incident.guardianNotes || [],
      responderEtaMinutes: incident.responderEtaMinutes,
      deviceBatteryLevel: incident.deviceBatteryLevel
    };
  }

  if (role === 'School') {
    // School View: Support learner welfare and campus security
    return {
      ...baseProjection,
      guardianName: incident.guardianName,
      teacherAssigned: incident.teacherAssigned,
      principalNotified: incident.principalNotified,
      parentContactedStatus: incident.parentContactedStatus,
      schoolNurseStatus: incident.schoolNurseStatus,
      safeRoomAssignment: incident.safeRoomAssignment,
      schoolLockdownStatus: incident.schoolLockdownStatus,
      schoolObservations: incident.schoolObservations,
      cctvEvidenceCount: incident.cctvEvidenceCount
    };
  }

  if (role === 'Government' || role === 'Technician' || (role as string) === 'Responder') {
    // Responder View: Tactical guidance, navigation, checklists
    return {
      ...baseProjection,
      assignedOfficer: incident.assignedOfficer,
      responderType: incident.responderType,
      responderEtaMinutes: incident.responderEtaMinutes,
      responderLocation: incident.responderLocation,
      responderArrivalConfirmed: incident.responderArrivalConfirmed,
      gpsAccuracyMeters: incident.gpsAccuracyMeters,
      deviceBatteryLevel: incident.deviceBatteryLevel,
      sceneChecklist: incident.sceneChecklist,
      resolutionChecklist: incident.resolutionChecklist,
      capturedEvidence: incident.capturedEvidence,
      evidenceNotes: incident.evidenceNotes
    };
  }

  if (role === 'Executive') {
    // Executive View: Aggregated summary only
    return {
      id: incident.id,
      date: incident.date,
      time: incident.time,
      status: incident.status,
      category: incident.category,
      priority: incident.priority,
      schoolName: incident.schoolName,
      timeline: getRoleTailoredTimeline(incident.timeline || [], role)
    };
  }

  return baseProjection;
}
