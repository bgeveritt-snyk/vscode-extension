import { ExtensionContext, DiagnosticCollection, StatusBarItem, TextDocument, TextEditor } from 'vscode';
import * as vscode from 'vscode';
import { IFilePath, IFileBundle, ISuggestions, IAnalysisResult, ISuggestion, IFileSuggestion } from '@snyk/code-client';

export interface StatusBarItemInterface {
  snykStatusBarItem: StatusBarItem;
  show(): void;
}

export interface BaseSnykModuleInterface {
  refreshViewEmitter: vscode.EventEmitter<any>;
  refreshViews(content: any): void;
  analysisStatus: string;
  analysisProgress: string;
  source: string;
  staticToken: string;
  defaultBaseURL: string;
  baseURL: string;
  authHost: string;
  termsConditionsUrl: string;
  token: string;
  setToken(token: string): Promise<void>;
  uploadApproved: boolean;
  shouldReportErrors: boolean;
  shouldReportEvents: boolean;
  setUploadApproved(value: boolean): Promise<void>;
  remoteBundle: IFileBundle;
  changedFiles: Set<string>;
  analyzer: AnalyzerInterface;
  statusBarItem: StatusBarItemInterface;
  filesWatcher: vscode.FileSystemWatcher;
  settingsWatcher: SnykWatcherInterface;
  setLoadingBadge(value: boolean): Promise<void>;
  setContext(key: string, value: unknown): Promise<void>;
  shouldShowAnalysis: boolean;
  emitViewInitialized(): void;

  // Abstract methods
  processError(error: errorType, options?: { [key: string]: any }): Promise<void>;
  processEvent(event: string, options: { [key: string]: any }): Promise<void>;
  startExtension(): Promise<void>;
}

export interface ReportModuleInterface {
  resetTransientErrors(): void;
  trackViewSuggestion(issueId: string, severity: number): Promise<void>;
}

export interface LoginModuleInterface {
  initiateLogin(): Promise<void>;
  checkSession(): Promise<string>;
  approveUpload(): Promise<void>;
  checkApproval(): Promise<boolean>;
  checkWelcomeNotification(): Promise<void>;
  checkAdvancedMode(): Promise<void>;
}

export interface BundlesModuleInterface {
  readonly runningAnalysis: boolean;
  readonly lastAnalysisDuration: number;
  readonly lastAnalysisTimestamp: number;
  startAnalysis(): Promise<void>;
}

export interface SnykLibInterface {
  setMode(mode: string): void;
}

export interface ExtensionInterface
  extends BaseSnykModuleInterface,
    ReportModuleInterface,
    LoginModuleInterface,
    BundlesModuleInterface,
    SnykLibInterface {
  context: vscode.ExtensionContext | undefined;
  activate(context: ExtensionContext): void;
}

export interface SnykWatcherInterface {
  activate(extension: ExtensionInterface | any): void;
}

export interface SuggestionProviderInterface {
  activate(extension: ExtensionInterface): void;
  show(suggestionId: string, uri: vscode.Uri, position: vscode.Range): void;
  checkCurrentSuggestion(): void;
}

export type userStateItemType = string | number | boolean | undefined;

export type configType = string | Function;

export type errorType = Error | any;

export type filesForSaveListType = string[];

export type completeFileSuggestionType = ISuggestion &
  IFileSuggestion & {
    uri: string;
  };

export type openedTextEditorType = {
  fullPath: string;
  workspace: string;
  lineCount: {
    current: number;
    prevOffset: number;
  };
  contentChanges: any[];
  document: TextDocument;
};

export interface StateIitemsInterface {
  [key: string]: string;
}

export interface StateSelectorsInterface {
  [key: string]: Function;
}

export interface SingleIssuePositionInterface {
  cols: number[];
  rows: number[];
}

export interface IssuesListOptionsInterface {
  fileIssuesList: IFilePath;
  suggestions: ISuggestions;
  fileUri: vscode.Uri;
}

export interface AnalyzerInterface {
  activate(extension: ExtensionInterface | any): void;
  snykReview: DiagnosticCollection | undefined;
  analysisResults: IAnalysisResult;
  findSuggestion(suggestionName: string): ISuggestion | undefined;
  getFullSuggestion(
    suggestionId: string,
    uri: vscode.Uri,
    position: vscode.Range,
  ): completeFileSuggestionType | undefined;
  checkFullSuggestion(suggestion: completeFileSuggestionType): boolean;
  createReviewResults(): Promise<void>;
  updateReviewResultsPositions(extension: ExtensionInterface, updatedFile: openedTextEditorType): Promise<void>;
  setIssuesMarkersDecoration(editor: TextEditor | undefined): void;
}
