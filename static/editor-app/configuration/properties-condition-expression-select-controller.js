/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/*
 * Condition expression
 */

/*var KisBpmConditionExpressionCtrl = [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];*/
var dataList = [];
var KisBpmConditionExpressionSelectCtrl = [ '$scope', '$translate', '$http', function($scope, $translate, $http) {

    // Put json representing condition on scope
    /*if ($scope.property.value !== undefined && $scope.property.value !== null) {

        $scope.conditionExpression = {value: $scope.property.value};

    } else {
        $scope.conditionExpression = {value: ''};
    }*/
    $http({method: 'GET', url: KISBPM.URL.getCondition()}).success(function (data, status, headers, config) {
        if(data.ok){
            $scope.conditionItems = data.data;
            dataList = data.data;
        }
    }).
    error(function (data, status, headers, config) {
        console.log('KisBpmConditionExpressionSelectCtrl is wrong!');
    });


    $scope.conditionExpressionChanged = function () {
        // console.log($scope.property);
        //$scope.property.value = $scope.conditionExpression.value;
        $scope.updatePropertyInModel($scope.property);
    };

    /*$scope.save = function() {
        $scope.property.value = $scope.conditionExpression.value;
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
        $scope.property.mode = 'read';
        $scope.$hide();
    };*/

}];

// 获取跳转条件数据
var ConditionExpressionDisplayCtrl = ['$scope', '$http', function ($scope, $http) {
    $http({method: 'GET', url: KISBPM.URL.getCondition()}).success(function (data, status, headers, config) {
        if ($scope.property.value!='' && $scope.property.value!=null) {
            let list = data.data;
            for(var i=0;i<list.length;i++){
                if(list[i].condition == $scope.property.value){
                    $scope.name = list[i].name;
                }
            }
        }
        
    });
    
    // if ($scope.property.value!='' && $scope.property.value!=null) {
        // var codeStr = $scope.property.value.split('"')[1];
        // $http({
        //     method: 'GET',
        //     url: KISBPM.URL.getConditionByCode(codeStr)
        // }).success(function (data, status, headers, config) {
        //     if (!data.data) {
        //         return;
        //     }
        //     if (data.ok == true) {
               
        //         // $scope.name = data.data.name;
        //     }
        // }).
        // error(function (data, status, headers, config) {
        //     console.log('ConditionExpressionDisplayCtrl is wrong!');
        // });
    // }

    $scope.clearConditionExpression = function () {
        if ($scope.property.value!='' && $scope.property.value!=null) {
            $scope.property.value = '';
            $scope.updatePropertyInModel($scope.property);
        }
    }

}];