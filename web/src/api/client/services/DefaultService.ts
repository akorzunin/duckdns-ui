/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DbTaskLog } from '../models/DbTaskLog';
import type { Domain } from '../models/Domain';
import type { Task } from '../models/Task';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Health check
     * @returns any OK
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Get devMode
     * @returns any OK
     * @throws ApiError
     */
    public static getDevmode(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devmode',
        });
    }
    /**
     * Add a new domain
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiDomain(
        requestBody: Domain,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/domain',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get a specific domain
     * @param domain
     * @returns Domain OK
     * @throws ApiError
     */
    public static getApiDomain(
        domain: string,
    ): CancelablePromise<Domain> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/domain/{domain}',
            path: {
                'domain': domain,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Delete a specific domain
     * @param domain
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiDomain(
        domain: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/domain/{domain}',
            path: {
                'domain': domain,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Get all domains
     * @returns Domain OK
     * @throws ApiError
     */
    public static getApiAllDomains(): CancelablePromise<Array<Domain>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/all-domains',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get a specific task by domain
     * @param domain
     * @returns Task OK
     * @throws ApiError
     */
    public static getApiTask(
        domain: string,
    ): CancelablePromise<Task> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/task/{domain}',
            path: {
                'domain': domain,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Delete a task by domain
     * @param domain
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiTask(
        domain: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/task/{domain}',
            path: {
                'domain': domain,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Create a new task
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiTask(
        requestBody: Task,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/task',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get all tasks
     * @returns Task OK
     * @throws ApiError
     */
    public static getApiAllTasks(): CancelablePromise<Array<Task>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/all-tasks',
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Delete all tasks
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiAllTasks(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/all-tasks',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get task logs by domain
     * @param domain
     * @returns DbTaskLog Successful operation
     * @throws ApiError
     */
    public static getApiTaskLogs(
        domain: string,
    ): CancelablePromise<Array<DbTaskLog>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/task/logs/{domain}',
            path: {
                'domain': domain,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete task logs by domain
     * @param domain
     * @returns string Successful operation
     * @throws ApiError
     */
    public static deleteApiTaskLogs(
        domain: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/task/logs/{domain}',
            path: {
                'domain': domain,
            },
        });
    }
}
