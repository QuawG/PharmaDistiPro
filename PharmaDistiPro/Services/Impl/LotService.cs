using PharmaDistiPro.DTO.Lots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{
    public class LotService : ILotService
    {
        private readonly ILotRepository _lotRepository;

        public LotService(ILotRepository lotRepository)
        {
            _lotRepository = lotRepository;
        }

        public async Task<Response<LotResponse>> CreateLot(LotRequest lot)
        {
            var response = new Response<LotResponse>();
            if (lot == null)
            {
                response = new Response<LotResponse>
                {
                    StatusCode = 400,
                    Message = "Dữ liệu không hợp lệ!"
                };
                return response;
            }
            Lot NewLot = new Lot
            {
                LotCode = lot.LotCode,
                CreatedBy = lot.CreatedBy,
                CreatedDate = DateTime.Now
            };
            NewLot = await _lotRepository.CreateLot(NewLot);
            if (NewLot != null)
            {
                LotResponse lotResponse = new LotResponse
                {
                    LotCode = NewLot.LotCode,
                    CreatedBy = NewLot.CreatedBy,
                    CreatedDate = NewLot.CreatedDate
                };
                response = new Response<LotResponse>
                {
                    StatusCode = 200,
                    Data = lotResponse
                };
                return response;
            }
            response = new Response<LotResponse>
            {
                StatusCode = 500,
                Message = "Lỗi khi tạo lô!"
            };
            return response;
        }

        public async Task<Response<Lot>> GetLotByLotCode(string lotCode)
        {
            var response = new Response<Lot>();
            var lot = await _lotRepository.GetLotByLotCode(lotCode);
            if(lot == null)
            {
                response = new Response<Lot>
                {
                    StatusCode = 404,
                    Message = "Không tìm thấy lô"
                };
                return response;
            }
            response = new Response<Lot>
            {
                StatusCode = 200,
                Data = lot
            };
            return response;
        }

        public async Task<Response<List<Lot>>> GetLotList()
        {
            var lots = await _lotRepository.GetLotList();
            var response = new Response<List<Lot>>();
            if (lots == null)
            {
                response = new Response<List<Lot>>
                {
                    StatusCode = 500,
                    Message = "Lỗi khi lấy dữ liệu lô!"
                };
                return response;
            }
            if(lots.Count <= 0)
            {
                response = new Response<List<Lot>>
                {
                    StatusCode = 404,
                    Message = "Không có lô nào!"
                };
                return response;
            }
            response = new Response<List<Lot>>
            {
                StatusCode = 200,
                Data = lots
            };
            return response;
        }

        public async Task<Response<LotResponse>> UpdateLot(string LotCode ,LotRequest lot)
        {
           var response = new Response<LotResponse>();
           var existed = await _lotRepository.GetLotByLotCode(LotCode);
            if (existed == null)
            {
                response = new Response<LotResponse>
                {
                    StatusCode = 404,
                    Message = "Không tìm thấy lô"
                };
                return response;
            }


            existed.LotCode = lot.LotCode;
            existed.CreatedBy = lot.CreatedBy;
            var updatedLot = await _lotRepository.UpdateLot(existed);
            if (updatedLot != null)
            {
                LotResponse lotResponse = new LotResponse
                {
                    LotCode = updatedLot.LotCode,
                    CreatedBy = updatedLot.CreatedBy,
                    CreatedDate = updatedLot.CreatedDate
                };
                response = new Response<LotResponse>
                {
                    StatusCode = 200,
                    Data = lotResponse
                };
                return response;
            }
            response = new Response<LotResponse>
            {
                StatusCode = 500,
                Message = "Lỗi khi cập nhật lô"
            };
            return response;
        }
    }
}

