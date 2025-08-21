import { Injectable } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { ReturnQueryDto } from './dto/return-query.dto';
import { ReturnModel } from '../domain/return.model';
import { ReturnMapper } from '../domain/mappers/return.mapper';
import { ReturnStatusEnum } from '../common/enums/return-status.enum';
import { ReturnsRepository } from './returns.repository';

/**
 * Service responsible for managing return operations including creation, retrieval,
 * and status updates for product returns and refunds.
 *
 * @class ReturnsService
 * @since 1.0.0
 */
@Injectable()
export class ReturnsService {
  constructor(private readonly repo: ReturnsRepository) {}

  /**
   * Creates a new return request for an order with reason and refund amount.
   * Initializes return with REQUESTED status for approval workflow.
   *
   * @async
   * @function create
   * @param {CreateReturnDto} dto - Return creation data including order, reason, and refund amount
   * @returns {Promise<ReturnModel>} The created return model
   * @throws {ValidationException} When return data is invalid
   *
   * @example
   * ```typescript
   * const returnRequest = await returnsService.create({
   *   orderId: 'order-id-123',
   *   userId: 'user-id-456',
   *   reason: 'Product arrived damaged',
   *   refundAmount: 299.99
   * });
   * console.log(returnRequest.id); // Generated return ID
   * ```
   *
   * @since 1.0.0
   */
  async create(dto: CreateReturnDto): Promise<ReturnModel> {
    const model = ReturnMapper.fromCreateDto(dto);
    return this.repo.create({
      orderId: model.orderId,
      userId: model.userId,
      reason: model.reason,
      status: model.status as any,
      refundAmount: model.refundAmount,
    } as any);
  }

  /**
   * Retrieves return requests with optional filtering by user, order, status, and pagination.
   *
   * @async
   * @function findAll
   * @param {ReturnQueryDto} query - Query parameters for filtering and pagination
   * @returns {Promise<ReturnModel[]>} Array of return models matching the criteria
   *
   * @example
   * ```typescript
   * const pendingReturns = await returnsService.findAll({
   *   status: ReturnStatusEnum.REQUESTED,
   *   skip: 0,
   *   take: 10
   * });
   * console.log(`Found ${pendingReturns.length} pending returns`);
   * ```
   *
   * @since 1.0.0
   */
  async findAll(query: ReturnQueryDto): Promise<ReturnModel[]> {
    return this.repo.findAll(query);
  }

  /**
   * Retrieves a return request by its unique identifier.
   *
   * @async
   * @function findOne
   * @param {string} id - The unique identifier of the return request
   * @returns {Promise<ReturnModel | undefined>} The return model if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const returnRequest = await returnsService.findOne('return-id-123');
   * if (returnRequest) {
   *   console.log(`Return reason: ${returnRequest.reason}`);
   *   console.log(`Refund amount: $${returnRequest.refundAmount}`);
   * }
   * ```
   *
   * @since 1.0.0
   */
  async findOne(id: string): Promise<ReturnModel | undefined> {
    return this.repo.findById(id);
  }

  /**
   * Updates the status of a return request (e.g., REQUESTED -> APPROVED -> COMPLETED).
   * Validates status transitions to ensure proper return processing workflow.
   *
   * @async
   * @function updateStatus
   * @param {string} id - The unique identifier of the return request to update
   * @param {UpdateReturnStatusDto} dto - New status information
   * @returns {Promise<ReturnModel | undefined>} The updated return model if found, undefined otherwise
   * @throws {BadRequestException} When status transition is invalid
   *
   * @example
   * ```typescript
   * const approvedReturn = await returnsService.updateStatus('return-id-123', {
   *   status: ReturnStatusEnum.APPROVED
   * });
   * if (approvedReturn) {
   *   console.log(`Return approved for $${approvedReturn.refundAmount}`);
   * }
   * ```
   *
   * @since 1.0.0
   */
  async updateStatus(
    id: string,
    dto: UpdateReturnStatusDto,
  ): Promise<ReturnModel | undefined> {
    return this.repo.updateStatus(id, dto.status as unknown as string);
  }
}
