#include <vector>
#include <cmath>

using namespace std;

int main(){
  return 0;
}

double mean(vector<double> v){
    if (v.empty()) return 0.0;
  
    double sum = 0.0;
    for(double x:v){
        sum += x;
    }
    return sum / v.size();
}

double variance(vector<double> v){
    int n = v.size();
    if (n < 2) return 0.0;
  
    double sum = 0.0;
    double sum_sq = 0.0;

    for (double x : v){
        sum    += x;
        sum_sq += x * x;
    }
    return (sum_sq - (sum * sum) / n) / (n - 1);
}

double pearson_r(vector<double> A, vector<double> B) {
    if (A.empty() || A.size() != B.size()) return 0.0;

    int n = A.size();

    double sum_A = 0.0, sum_B = 0.0;
    for (double a : A) sum_A += a;
    for (double b : B) sum_B += b;
    double mean_A = sum_A / n;
    double mean_B = sum_B / n;

    double num = 0.0, den_A = 0.0, den_B = 0.0;
    for (int i = 0; i < n; i++) {
        double diff_A = A[i] - mean_A;
        double diff_B = B[i] - mean_B;
        num   += diff_A * diff_B;
        den_A += diff_A * diff_A;
        den_B += diff_B * diff_B;
    }

    if (den_A == 0.0 || den_B == 0.0) return 0.0;

    return num / sqrt(den_A * den_B);
}

vector<char> dec_to_septapus(int n){return {};}
vector<char> dec_to_octopus(int n){return {};}
vector<char> dec_to_hexakaidecapus(int n){return {};}
vector<char> septapus_to_dec(vector<char> s){return {};}
vector<char> octopus_to_dec(vector<char> s){return {};}
vector<char> hexakaidecapus_to_dec(vector<char> s){return {};}
vector<char> septapus_to_octopus(vector<char> s){return {};}
vector<char> septapus_to_hexakaidecapus(vector<char> s){return {};}
vector<char> octapus_to_septapus(vector<char> s){return {};}
vector<char> octopus_to_hexakaidecapus(vector<char> s){return {};}
vector<char> hexakaidecapus_to_septapus(vector<char> s){return {};}
vector<char> hexakaidecapus_to_octopus(vector<char> s){return {};}
